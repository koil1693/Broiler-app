package com.example.broiler.service;

import com.example.broiler.domain.OrderStatus;
import com.example.broiler.repository.OrderRepository;
import com.example.broiler.repository.TripRepository;
import com.example.broiler.web.dto.DashboardSummary;
import com.example.broiler.web.dto.DailyTripSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TripRepository tripRepository;
    private final OrderRepository orderRepository;
    private final ReportService reportService; // Inject ReportService

    @Transactional(readOnly = true)
    public DashboardSummary getDashboardSummary(LocalDate date) {
        long totalTripsToday = tripRepository.findByTripDate(date).size();
        long totalPendingOrders = orderRepository.findByStatus(OrderStatus.PENDING).size();
        
        // Placeholder for total revenue today - needs more complex calculation
        BigDecimal totalRevenueToday = BigDecimal.ZERO; 

        // Fetch trip history for the chart
        LocalDate sevenDaysAgo = date.minusDays(7);
        List<DailyTripSummaryDto> tripHistory = reportService.getDailyTripSummaries(sevenDaysAgo, date);

        return new DashboardSummary(date, totalTripsToday, totalPendingOrders, totalRevenueToday, tripHistory);
    }
}
