package com.breakdown.dto;

import com.breakdown.entity.SenderType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    private Long id;
    private Long requestId;
    private SenderType senderType;
    private String message;
    private Instant createdAt;
}