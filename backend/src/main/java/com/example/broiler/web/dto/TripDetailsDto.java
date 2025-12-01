package com.example.broiler.web.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripDetailsDto {
    private Long tripId;
    private String routeName;
    private String driverName;
    private Integer units;
    private BigDecimal weight;
}