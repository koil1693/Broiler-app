package com.example.broiler.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VendorLedger {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Vendor vendor;

    @Column(nullable = false)
    private LocalDate date;

    private String description;

    @Column(precision = 10, scale = 2)
    private BigDecimal debit; // Bill Amount

    @Column(precision = 10, scale = 2)
    private BigDecimal credit; // Collection

    @Column(precision = 10, scale = 2)
    private BigDecimal balance; // Running Balance

    private String referenceId; // Order ID or Payment ID
}
