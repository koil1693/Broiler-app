package com.example.broiler.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
public class DashboardSummary {
    private LocalDate date;
    private long totalTripsToday;
    private long totalPendingOrders;
    private BigDecimal totalRevenueToday; // Example metric
    private List<DailyTripSummaryDto> tripHistory; // For the chart
}
