package com.example.broiler.repository;

import com.example.broiler.domain.DailySummary;
import com.example.broiler.domain.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface DailySummaryRepository extends JpaRepository<DailySummary, Long> {
    List<DailySummary> findByVendorOrderBySummaryDateDesc(Vendor vendor);
    boolean existsByVendorAndSummaryDate(Vendor vendor, LocalDate summaryDate);
    List<DailySummary> findBySummaryDate(LocalDate summaryDate); // New method
}
