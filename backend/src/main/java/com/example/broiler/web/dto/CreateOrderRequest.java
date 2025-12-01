package com.example.broiler.web.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class CreateOrderRequest {
    @NotNull
    private Long vendorId;
    @NotNull
    private Integer assignedUnits;
    @NotNull
    private LocalDate orderDate;

    public Long getVendorId() {
        return vendorId;
    }

    public Integer getAssignedUnits() {
        return assignedUnits;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }
}
