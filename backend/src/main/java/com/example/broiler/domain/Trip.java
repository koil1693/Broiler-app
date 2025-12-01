package com.example.broiler.domain;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate tripDate;

    @Column(nullable = false)
    private String status;

    @ManyToOne(optional = false)
    private Driver driver;

    private String routeName;

    @Column(precision = 10, scale = 2)
    private java.math.BigDecimal loadedWeight;

    @Column(precision = 10, scale = 2)
    private java.math.BigDecimal stockWeight;

    @OneToMany(mappedBy = "trip")
    @JsonManagedReference
    private List<Order> orders;
}
