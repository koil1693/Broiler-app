package com.example.broiler.web.dto;

import lombok.Data;
import java.util.List;

@Data
public class AssignOrdersRequest {
    @jakarta.validation.constraints.NotNull(message = "Trip ID is required")
    private Long tripId;

    @jakarta.validation.constraints.NotNull(message = "Order IDs list is required")
    @jakarta.validation.constraints.NotEmpty(message = "Order IDs list cannot be empty")
    private List<Long> orderIds;

    // Explicitly adding getters to ensure compile-time safety
    public Long getTripId() {
        return tripId;
    }

    public List<Long> getOrderIds() {
        return orderIds;
    }
}
