package com.example.broiler.repository;

import com.example.broiler.domain.VendorRateOffset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface VendorRateOffsetRepository extends JpaRepository<VendorRateOffset, Long> {
    /**
     * Finds the most recent rate offset for a given vendor that is effective on or before the specified date.
     * This method uses Spring Data JPA's query derivation, which is cleaner and less error-prone than a custom @Query.
     * It translates to: "Find the top 1 record, for the given vendorId, where the effectiveDate is less than or equal to the target date,
     * ordered by the effectiveDate in descending order."
     */
    Optional<VendorRateOffset> findTopByVendorIdAndEffectiveDateLessThanEqualOrderByEffectiveDateDesc(Long vendorId, LocalDate date);
    Optional<VendorRateOffset> findByVendorIdAndEffectiveDate(Long vendorId, LocalDate date);

}