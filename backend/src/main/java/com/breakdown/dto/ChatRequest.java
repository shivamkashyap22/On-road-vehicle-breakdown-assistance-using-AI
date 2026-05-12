package com.breakdown.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ChatRequest {
    @NotNull
    private Long requestId;
    private String message;
}
