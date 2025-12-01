package com.example.broiler.service;

import com.example.broiler.domain.*;
import com.example.broiler.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ReconciliationService {

    private final OrderRepository orderRepository;
    private final DailySummaryRepository dailySummaryRepository;
    private final VendorRepository vendorRepository;
    private final RateService rateService;

    @Transactional
    public DailySummary calculateAndSaveDailySummary(Long vendorId, LocalDate date) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found"));

        if (dailySummaryRepository.existsByVendorAndSummaryDate(vendor, date)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A summary for this vendor and date already exists.");
        }

        List<Order> orders = orderRepository.findByVendorAndOrderDate(vendor, date);
        if (orders.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No orders found for this vendor on the specified date.");
        }

        BigDecimal totalWeight = orders.stream()
                .map(Order::getWeight)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPaymentsOnDate = orders.stream()
                .map(Order::getPaymentAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal appliedRate = rateService.getEffectiveRate(vendorId, date);
        BigDecimal calculatedAmount = totalWeight.multiply(appliedRate);
        BigDecimal dueAmount = calculatedAmount.subtract(totalPaymentsOnDate);

        DailySummary summary = DailySummary.builder()
                .vendor(vendor)
                .summaryDate(date)
                .totalWeight(totalWeight)
                .appliedRate(appliedRate)
                .calculatedAmount(calculatedAmount)
                .totalPaid(totalPaymentsOnDate)
                .dueAmount(dueAmount)
                .build();

        return dailySummaryRepository.save(summary);
    }

    @Transactional(readOnly = true)
    public boolean summaryExists(Long vendorId, LocalDate date) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found"));
        return dailySummaryRepository.existsByVendorAndSummaryDate(vendor, date);
    }
}
