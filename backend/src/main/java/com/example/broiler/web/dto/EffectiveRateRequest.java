package com.example.broiler.web.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class EffectiveRateRequest {
    private Long vendorId;
    private LocalDate date;
    private BigDecimal offset; // The optional "what-if" offset
}