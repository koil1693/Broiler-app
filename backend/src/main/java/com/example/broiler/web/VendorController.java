package com.example.broiler.web;

import com.example.broiler.domain.Vendor;
import com.example.broiler.service.LedgerService;
import com.example.broiler.service.VendorService;
import com.example.broiler.web.dto.VendorLedgerDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;
    private final LedgerService ledgerService; // Inject LedgerService

    @GetMapping
    public ResponseEntity<List<Vendor>> getAllVendors() {
        return ResponseEntity.ok(vendorService.findAll());
    }

    @PostMapping
    public ResponseEntity<Vendor> createVendor(@Validated @RequestBody Vendor vendor) {
        return ResponseEntity.ok(vendorService.create(vendor));
    }

    @GetMapping("/{vendorId}/ledger")
    public ResponseEntity<VendorLedgerDto> getVendorLedger(@PathVariable("vendorId") Long vendorId) {
        // Call the correct service
        return ResponseEntity.ok(ledgerService.getVendorLedger(vendorId));
    }
}
