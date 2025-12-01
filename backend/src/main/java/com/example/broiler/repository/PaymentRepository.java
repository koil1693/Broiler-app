package com.example.broiler.repository;

import com.example.broiler.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByVendorIdOrderByDateDesc(Long vendorId);
}
