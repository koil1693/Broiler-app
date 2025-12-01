package com.example.broiler.domain;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VendorRateOffset {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal offsetValue;

    @Column(nullable = false)
    private LocalDate effectiveDate;

    @ManyToOne(optional = false)
    @JoinColumn(name="vendor_id")
    @JsonBackReference
    private Vendor vendor;
}
