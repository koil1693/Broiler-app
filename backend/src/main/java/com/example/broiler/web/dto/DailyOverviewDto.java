package com.example.broiler.web.dto;

import com.example.broiler.domain.DailySummary;
import com.example.broiler.domain.VendorPayment;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class DailyOverviewDto {
    private LocalDate date;
    private List<DailySummary> dailySummaries;
    private List<VendorPayment> dailyPayments;
    private BigDecimal totalCalculatedAmount;
    private BigDecimal totalPaidAmount;
    private BigDecimal totalDueAmount;
}
