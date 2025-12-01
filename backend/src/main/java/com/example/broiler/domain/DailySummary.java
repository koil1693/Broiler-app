package com.example.broiler.domain;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DailySummary {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Vendor vendor;

    @Column(nullable = false)
    private LocalDate summaryDate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalWeight;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal appliedRate;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal calculatedAmount;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPaid;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal dueAmount;

    @Column(nullable = false)
    @Builder.Default
    private boolean isFinalized = false;
}
