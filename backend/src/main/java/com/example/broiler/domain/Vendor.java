package com.example.broiler.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String contactPerson;
    private String phoneNumber;
    private String address;

    private BigDecimal rateOffset;

    @Column(precision = 10, scale = 2)
    private BigDecimal currentBalance; // Cached balance from ledger
}
