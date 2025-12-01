package com.example.broiler.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DeliveryLine {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double weight;
    private Double finalRate;
    private Double amount;
    private Integer deliveredUnits;
    private String weightSource;
    private String photoUrl;

    @ManyToOne(optional = false)
    private TripStop stop;
}
