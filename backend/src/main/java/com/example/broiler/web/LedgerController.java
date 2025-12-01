package com.example.broiler.web;

import com.example.broiler.domain.DailySummary;
import com.example.broiler.domain.VendorPayment;
import com.example.broiler.service.LedgerService;
import com.example.broiler.web.dto.DailyOverviewDto;
import com.example.broiler.web.dto.RecordPaymentRequest; // Import new DTO
import com.example.broiler.web.dto.VendorLedgerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/ledger")
@RequiredArgsConstructor
public class LedgerController {

    private final LedgerService ledgerService;

    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<VendorLedgerDto> getVendorLedger(@PathVariable("vendorId") Long vendorId) {
        return ResponseEntity.ok(ledgerService.getVendorLedger(vendorId));
    }

    @GetMapping("/vendors")
    public ResponseEntity<java.util.List<com.example.broiler.web.dto.VendorFinancialSummaryDto>> getVendorFinancialSummaries() {
        return ResponseEntity.ok(ledgerService.getVendorFinancialSummaries());
    }

    @GetMapping("/daily-overview")
    public ResponseEntity<DailyOverviewDto> getDailyOverview(
            @RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate queryDate = (date == null) ? LocalDate.now() : date;
        return ResponseEntity.ok(ledgerService.getDailyOverview(queryDate));
    }

    @PostMapping("/summaries/{summaryId}/finalize")
    public ResponseEntity<DailySummary> finalizeSummary(@PathVariable("summaryId") Long summaryId) {
        return ResponseEntity.ok(ledgerService.finalizeSummary(summaryId));
    }

    @PostMapping("/payments")
    public ResponseEntity<VendorPayment> recordPayment(@RequestBody RecordPaymentRequest request) { // Use new DTO
        return ResponseEntity.ok(ledgerService.recordPayment(request));
    }
}
