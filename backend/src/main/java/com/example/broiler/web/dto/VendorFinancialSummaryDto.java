package com.example.broiler.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorFinancialSummaryDto {
    private Long vendorId;
    private String vendorName;
    private BigDecimal totalBilled;
    private BigDecimal totalPaid;
    private BigDecimal outstandingBalance;
}
