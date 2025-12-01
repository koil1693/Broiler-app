package com.example.broiler.repository;

import com.example.broiler.domain.Vendor;
import com.example.broiler.domain.VendorPayment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface VendorPaymentRepository extends JpaRepository<VendorPayment, Long> {
    List<VendorPayment> findByPaymentDate(LocalDate paymentDate);
    List<VendorPayment> findByVendor(Vendor vendor); // New method
}
