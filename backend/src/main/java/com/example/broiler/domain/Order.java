package com.example.broiler.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Vendor vendor;

    @Column(nullable = false)
    private LocalDate orderDate;

    @Column(nullable = false)
    private Integer assignedUnits;

    @Column
    private Integer deliveredUnits;

    @Column(precision = 10, scale = 2)
    private BigDecimal weight; // New field for weight

    @Column(precision = 10, scale = 2)
    private BigDecimal paymentAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    @JsonBackReference
    private Trip trip;

    // We will add a link to DailySummary later if needed, keeping it simple for now.
}
