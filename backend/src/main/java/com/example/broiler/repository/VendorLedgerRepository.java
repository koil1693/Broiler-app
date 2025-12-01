package com.example.broiler.repository;

import com.example.broiler.domain.VendorLedger;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VendorLedgerRepository extends JpaRepository<VendorLedger, Long> {
    List<VendorLedger> findByVendorIdOrderByDateDesc(Long vendorId);
}
