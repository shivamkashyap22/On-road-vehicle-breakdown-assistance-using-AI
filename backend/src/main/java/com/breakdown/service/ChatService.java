package com.breakdown.service;

import com.breakdown.dto.ChatMessageDto;
import com.breakdown.dto.ChatRequest;
import com.breakdown.entity.*;
import com.breakdown.repository.BreakdownRequestRepository;
import com.breakdown.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Save chat messages and optionally get AI reply via OpenAIService.
 */
@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final BreakdownRequestRepository requestRepository;
    private final OpenAIService openAIService;

    @Transactional
    public ChatMessageDto sendMessage(Long userId, boolean isMechanic, ChatRequest request) {
        BreakdownRequest br = requestRepository.findById(request.getRequestId())
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        SenderType senderType = isMechanic ? SenderType.MECHANIC : SenderType.USER;
        ChatMessage userMsg = ChatMessage.builder()
                .requestId(request.getRequestId())
                .senderType(senderType)
                .message(request.getMessage())
                .build();
        userMsg = chatMessageRepository.save(userMsg);

        // If user sent message, get AI reply and save it
        if (!isMechanic && request.getMessage() != null && !request.getMessage().isBlank()) {
            String context = getContextForRequest(request.getRequestId());
            String aiReply = openAIService.getAssistantReply(request.getMessage(), context);
            ChatMessage aiMsg = ChatMessage.builder()
                    .requestId(request.getRequestId())
                    .senderType(SenderType.AI)
                    .message(aiReply)
                    .build();
            chatMessageRepository.save(aiMsg);
            return mapToDto(aiMsg);
        }
        return mapToDto(userMsg);
    }

    public List<ChatMessageDto> getHistory(Long requestId) {
        return chatMessageRepository.findByRequestIdOrderByCreatedAtAsc(requestId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private String getContextForRequest(Long requestId) {
        BreakdownRequest req = requestRepository.findById(requestId).orElse(null);
        if (req == null) return "";
        return "Problem type: " + req.getProblemType() + ". " + (req.getDescription() != null ? req.getDescription() : "");
    }

    private ChatMessageDto mapToDto(ChatMessage m) {
        return ChatMessageDto.builder()
                .id(m.getId())
                .requestId(m.getRequestId())
                .senderType(m.getSenderType())
                .message(m.getMessage())
                .createdAt(m.getCreatedAt())
                .build();
    }
}
