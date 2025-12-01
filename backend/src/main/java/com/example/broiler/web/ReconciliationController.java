package com.example.broiler.web;

import com.example.broiler.domain.DailySummary;
import com.example.broiler.service.ReconciliationService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reconciliation")
@RequiredArgsConstructor
public class ReconciliationController {

    private final ReconciliationService reconciliationService;

    @PostMapping
    public ResponseEntity<DailySummary> calculateDailySummary(
            @RequestParam("vendorId") Long vendorId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        DailySummary summary = reconciliationService.calculateAndSaveDailySummary(vendorId, date);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> summaryExists(
            @RequestParam("vendorId") Long vendorId,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        boolean exists = reconciliationService.summaryExists(vendorId, date);
        return ResponseEntity.ok(exists);
    }
}
