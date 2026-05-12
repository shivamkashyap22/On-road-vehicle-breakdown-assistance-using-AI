package com.breakdown.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class LocationUpdateDto {
    private BigDecimal latitude;
    private BigDecimal longitude;
}
