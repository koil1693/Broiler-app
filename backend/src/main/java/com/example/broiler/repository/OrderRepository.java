package com.example.broiler.repository;

import com.example.broiler.domain.Order;
import com.example.broiler.domain.OrderStatus;
import com.example.broiler.domain.Trip;
import com.example.broiler.domain.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByTrip(Trip trip);
    List<Order> findByVendorAndOrderDate(Vendor vendor, LocalDate date);
}
