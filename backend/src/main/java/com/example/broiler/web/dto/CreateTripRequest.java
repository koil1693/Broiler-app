package com.example.broiler.web.dto;

import java.time.LocalDate;
import jakarta.validation.constraints.*;

public class CreateTripRequest {
    @NotNull
    private LocalDate tripDate;
    @NotNull
    private Long driverId;
    @NotBlank
    private String routeName;

    private java.math.BigDecimal loadedWeight;

    // Explicitly adding getters to ensure compile-time safety
    public LocalDate getTripDate() {
        return tripDate;
    }

    public Long getDriverId() {
        return driverId;
    }

    public String getRouteName() {
        return routeName;
    }

    public java.math.BigDecimal getLoadedWeight() {
        return loadedWeight;
    }
}
