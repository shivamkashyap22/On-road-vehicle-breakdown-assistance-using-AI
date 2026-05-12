package com.breakdown.controller;

import com.breakdown.dto.ChatMessageDto;
import com.breakdown.dto.ChatRequest;
import com.breakdown.entity.User;
import com.breakdown.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * Chat: send message (optionally get AI reply), get history for a request.
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public ResponseEntity<ChatMessageDto> send(@AuthenticationPrincipal User user,
                                              @Valid @RequestBody ChatRequest request) {
        boolean isMechanic = user.getRole() == com.breakdown.entity.Role.MECHANIC;
        return ResponseEntity.ok(chatService.sendMessage(user.getId(), isMechanic, request));
    }

    @GetMapping("/{requestId}")
    public ResponseEntity<List<ChatMessageDto>> history(@PathVariable Long requestId,
                                                        @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(chatService.getHistory(requestId));
    }
}
