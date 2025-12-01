package com.example.broiler.service;

import com.example.broiler.domain.DailySummary;
import com.example.broiler.domain.Vendor;
import com.example.broiler.domain.VendorPayment;
import com.example.broiler.repository.DailySummaryRepository;
import com.example.broiler.repository.VendorPaymentRepository;
import com.example.broiler.repository.VendorRepository;
import com.example.broiler.repository.OrderRepository;
import com.example.broiler.web.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LedgerService {

        private final VendorRepository vendorRepository;
        private final DailySummaryRepository dailySummaryRepository;
        private final VendorPaymentRepository vendorPaymentRepository;
        private final OrderRepository orderRepository;

        @Transactional(readOnly = true)
        public VendorLedgerDto getVendorLedger(Long vendorId) {
                Vendor vendor = vendorRepository.findById(vendorId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Vendor not found"));

                List<DailySummary> summaries = dailySummaryRepository.findByVendorOrderBySummaryDateDesc(vendor);
                List<VendorPayment> payments = vendorPaymentRepository.findByVendor(vendor);

                BigDecimal totalCalculatedAmount = summaries.stream()
                                .map(DailySummary::getCalculatedAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalPaidAmount = payments.stream()
                                .map(VendorPayment::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalDueAmount = totalCalculatedAmount.subtract(totalPaidAmount);

                // Build unified ledger entries
                List<LedgerEntryDto> entries = new ArrayList<>();

                for (DailySummary summary : summaries) {
                        List<com.example.broiler.domain.Order> orders = orderRepository.findByVendorAndOrderDate(vendor,
                                        summary.getSummaryDate());
                        List<TripDetailsDto> tripDetails = orders.stream()
                                        .map(order -> TripDetailsDto.builder()
                                                        .tripId(order.getTrip().getId())
                                                        .routeName(order.getTrip().getRouteName())
                                                        .driverName(order.getTrip().getDriver().getName())
                                                        .units(order.getAssignedUnits())
                                                        .weight(order.getWeight())
                                                        .build())
                                        .collect(Collectors.toList());

                        entries.add(LedgerEntryDto.builder()
                                        .date(summary.getSummaryDate())
                                        .description("Daily Summary - " + summary.getSummaryDate() + " (Rate: "
                                                        + summary.getAppliedRate() + ")")
                                        .debit(summary.getCalculatedAmount())
                                        .credit(BigDecimal.ZERO)
                                        .type("INVOICE")
                                        .referenceId(String.valueOf(summary.getId()))
                                        .tripDetails(tripDetails)
                                        .build());
                }

                for (VendorPayment payment : payments) {
                        entries.add(LedgerEntryDto.builder()
                                        .date(payment.getPaymentDate())
                                        .description("Payment - " + payment.getPaymentMethod())
                                        .debit(BigDecimal.ZERO)
                                        .credit(payment.getAmount())
                                        .type("PAYMENT")
                                        .referenceId(String.valueOf(payment.getId()))
                                        .build());
                }

                // Sort by date ascending to calculate running balance
                entries.sort(Comparator.comparing(LedgerEntryDto::getDate));

                BigDecimal runningBalance = BigDecimal.ZERO;
                for (LedgerEntryDto entry : entries) {
                        runningBalance = runningBalance.add(entry.getDebit()).subtract(entry.getCredit());
                        entry.setBalance(runningBalance);
                }

                // Sort by date descending for display (latest first)
                entries.sort(Comparator.comparing(LedgerEntryDto::getDate).reversed());

                return new VendorLedgerDto(vendor.getName(), totalCalculatedAmount, totalPaidAmount, totalDueAmount,
                                entries);
        }

        @Transactional(readOnly = true)
        public List<VendorFinancialSummaryDto> getVendorFinancialSummaries() {
                List<Vendor> vendors = vendorRepository.findAll();
                List<VendorFinancialSummaryDto> summaries = new ArrayList<>();

                for (Vendor vendor : vendors) {
                        List<DailySummary> dailySummaries = dailySummaryRepository
                                        .findByVendorOrderBySummaryDateDesc(vendor);
                        List<VendorPayment> payments = vendorPaymentRepository.findByVendor(vendor);

                        BigDecimal totalBilled = dailySummaries.stream()
                                        .map(DailySummary::getCalculatedAmount)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                        BigDecimal totalPaid = payments.stream()
                                        .map(VendorPayment::getAmount)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                        BigDecimal outstandingBalance = totalBilled.subtract(totalPaid);

                        summaries.add(VendorFinancialSummaryDto.builder()
                                        .vendorId(vendor.getId())
                                        .vendorName(vendor.getName())
                                        .totalBilled(totalBilled)
                                        .totalPaid(totalPaid)
                                        .outstandingBalance(outstandingBalance)
                                        .build());
                }
                return summaries;
        }

        @Transactional(readOnly = true)
        public DailyOverviewDto getDailyOverview(LocalDate date) {
                List<DailySummary> dailySummaries = dailySummaryRepository.findBySummaryDate(date);
                List<VendorPayment> dailyPayments = vendorPaymentRepository.findByPaymentDate(date);

                BigDecimal totalCalculatedAmount = dailySummaries.stream()
                                .map(DailySummary::getCalculatedAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal totalPaidAmount = dailySummaries.stream()
                                .map(DailySummary::getTotalPaid)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                totalPaidAmount = totalPaidAmount.add(dailyPayments.stream()
                                .map(VendorPayment::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add));

                BigDecimal totalDueAmount = dailySummaries.stream()
                                .map(DailySummary::getDueAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                return new DailyOverviewDto(date, dailySummaries, dailyPayments, totalCalculatedAmount, totalPaidAmount,
                                totalDueAmount);
        }

        @Transactional
        public DailySummary finalizeSummary(Long summaryId) {
                DailySummary summary = dailySummaryRepository.findById(summaryId)
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "DailySummary not found"));

                if (summary.isFinalized()) {
                        throw new ResponseStatusException(HttpStatus.CONFLICT,
                                        "This summary has already been finalized.");
                }

                summary.setFinalized(true);
                return dailySummaryRepository.save(summary);
        }

        @Transactional
        public VendorPayment recordPayment(RecordPaymentRequest request) {
                Vendor vendor = vendorRepository.findById(request.getVendorId())
                                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                                "Vendor not found"));

                VendorPayment payment = VendorPayment.builder()
                                .vendor(vendor)
                                .amount(request.getAmount())
                                .paymentDate(request.getPaymentDate())
                                .paymentMethod(request.getPaymentMethod())
                                .notes(request.getNotes())
                                .build();

                return vendorPaymentRepository.save(payment);
        }
}
