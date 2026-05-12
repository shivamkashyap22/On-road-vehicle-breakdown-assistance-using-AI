package com.breakdown.dto;

import com.breakdown.entity.ProblemType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateBreakdownRequestDto {
    @NotNull
    private ProblemType problemType;
    @NotNull
    private BigDecimal userLatitude;
    @NotNull
    private BigDecimal userLongitude;
    private String description;
}
