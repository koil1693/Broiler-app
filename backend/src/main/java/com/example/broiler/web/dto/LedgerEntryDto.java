package com.example.broiler.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LedgerEntryDto {
    private LocalDate date;
    private String description;
    private BigDecimal debit; // Invoice Amount
    private BigDecimal credit; // Payment Amount
    private BigDecimal balance; // Running Balance
    private String referenceId;
    private String type; // "INVOICE" or "PAYMENT"
    private java.util.List<TripDetailsDto> tripDetails;
}
