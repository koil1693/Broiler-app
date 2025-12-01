package com.example.broiler.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VendorLedgerDto {
    private String vendorName;
    private BigDecimal totalCalculatedAmount;
    private BigDecimal totalPaidAmount;
    private BigDecimal totalDueAmount;
    private List<LedgerEntryDto> ledgerEntries;
}
