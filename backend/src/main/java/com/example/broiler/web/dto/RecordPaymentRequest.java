package com.example.broiler.web.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class RecordPaymentRequest {
    @NotNull
    private Long vendorId;

    @NotNull
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    private BigDecimal amount;

    @NotBlank
    private String paymentMethod; // e.g., "Cash", "Bank Transfer", "Check"

    private String notes;

    @NotNull
    private LocalDate paymentDate;
}
