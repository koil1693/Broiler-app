package com.example.broiler.dev;

import com.example.broiler.domain.*;
import com.example.broiler.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Profile("dev")
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final AdminRepository adminRepository;
    private final DriverRepository driverRepository;
    private final VendorRepository vendorRepository;
    private final TripRepository tripRepository;
    private final OrderRepository orderRepository;
    private final DailySummaryRepository dailySummaryRepository; // Inject DailySummaryRepository
    private final VendorPaymentRepository vendorPaymentRepository; // Inject VendorPaymentRepository
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (adminRepository.count() == 0) {
            createInitialData();
        }
    }

    private void createInitialData() {
        // --- Create Admin User ---
        String adminPassword = "VibeTech@2025";
        Admin admin = new Admin();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRole("ROLE_ADMIN");
        adminRepository.save(admin);

        logger.info("============================================================");
        logger.info("            Development Admin User Created");
        logger.info("            Username: admin");
        logger.info("            Password: {}", adminPassword);
        logger.info("============================================================");

        // --- Create Drivers ---
        Driver driver1 = driverRepository.save(Driver.builder()
                .name("John Doe")
                .username("johndoe")
                .password(passwordEncoder.encode("password123"))
                .build());
        Driver driver2 = driverRepository.save(Driver.builder()
                .name("Jane Smith")
                .username("janesmith")
                .password(passwordEncoder.encode("password123"))
                .build());

        // --- Create Vendors ---
        Vendor vendor1 = vendorRepository.save(Vendor.builder().name("KFC").rateOffset(BigDecimal.valueOf(0.1)).build());
        Vendor vendor2 = vendorRepository.save(Vendor.builder().name("Popeyes").rateOffset(BigDecimal.valueOf(-0.05)).build());
        Vendor vendor3 = vendorRepository.save(Vendor.builder().name("Churches").rateOffset(BigDecimal.ZERO).build());
        Vendor vendor4 = vendorRepository.save(Vendor.builder().name("Chick-fil-A").rateOffset(BigDecimal.valueOf(0.02)).build());

        // --- Create a Trip with pre-assigned orders for John Doe ---
        Trip preAssignedTrip = Trip.builder()
                .tripDate(LocalDate.now())
                .status("PLANNED")
                .driver(driver1)
                .routeName("Pre-Planned Route")
                .orders(new ArrayList<>())
                .build();
        tripRepository.save(preAssignedTrip); // Save trip first to get an ID

        Order order1 = Order.builder()
                .vendor(vendor1)
                .orderDate(LocalDate.now())
                .assignedUnits(100)
                .deliveredUnits(98) // Add delivered units
                .weight(BigDecimal.valueOf(150.50)) // Add weight
                .paymentAmount(BigDecimal.valueOf(1200.00)) // Add payment amount
                .status(OrderStatus.DELIVERED) // Mark as delivered for summary
                .trip(preAssignedTrip)
                .build();
        orderRepository.save(order1);

        Order order2 = Order.builder()
                .vendor(vendor2)
                .orderDate(LocalDate.now())
                .assignedUnits(120)
                .deliveredUnits(120)
                .weight(BigDecimal.valueOf(180.00))
                .paymentAmount(BigDecimal.valueOf(1500.00))
                .status(OrderStatus.DELIVERED)
                .trip(preAssignedTrip)
                .build();
        orderRepository.save(order2);
        
        // --- Create PENDING orders for today ---
        orderRepository.save(Order.builder()
                .vendor(vendor3)
                .orderDate(LocalDate.now())
                .assignedUnits(150)
                .status(OrderStatus.PENDING)
                .build());

        orderRepository.save(Order.builder()
                .vendor(vendor4)
                .orderDate(LocalDate.now())
                .assignedUnits(200)
                .status(OrderStatus.PENDING)
                .build());
        
        // --- Create another planned Trip for today (empty) for Jane Smith ---
        tripRepository.save(Trip.builder()
                .tripDate(LocalDate.now())
                .status("PLANNED")
                .driver(driver2)
                .routeName("South City Express")
                .build());

        // --- Create sample DailySummary ---
        DailySummary summary1 = DailySummary.builder()
                .vendor(vendor1)
                .summaryDate(LocalDate.now())
                .totalWeight(BigDecimal.valueOf(150.50))
                .appliedRate(BigDecimal.valueOf(1.10)) // Example rate
                .calculatedAmount(BigDecimal.valueOf(165.55)) // 150.50 * 1.10
                .totalPaid(BigDecimal.valueOf(1200.00))
                .dueAmount(BigDecimal.valueOf(-1034.45)) // 165.55 - 1200.00
                .isFinalized(false)
                .build();
        dailySummaryRepository.save(summary1);

        // --- Create sample VendorPayment ---
        VendorPayment payment1 = VendorPayment.builder()
                .vendor(vendor1)
                .paymentDate(LocalDate.now())
                .amount(BigDecimal.valueOf(500.00))
                .paymentMethod("Cash")
                .notes("Advance payment")
                .build();
        vendorPaymentRepository.save(payment1);
    }
}
