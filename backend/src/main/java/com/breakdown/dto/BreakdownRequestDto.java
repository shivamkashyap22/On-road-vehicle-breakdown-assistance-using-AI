package com.breakdown.dto;

import com.breakdown.entity.ProblemType;
import com.breakdown.entity.RequestStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BreakdownRequestDto {
    private Long id;
    private Long userId;
    private Long mechanicId;
    private ProblemType problemType;
    private BigDecimal userLatitude;
    private BigDecimal userLongitude;
    private RequestStatus status;
    private String description;
    private Instant createdAt;
    private String userFullName;
    private String mechanicFullName;
}