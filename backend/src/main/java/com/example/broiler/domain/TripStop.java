package com.example.broiler.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TripStop {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer sequence;
    private Integer assignedUnits;

    @ManyToOne(optional = false)
    private Trip trip;

    @ManyToOne(optional = false)
    private Vendor vendor;
}
