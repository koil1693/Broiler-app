package com.example.broiler.web.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class UpdateOrderDetailsRequest {
    private Integer deliveredUnits;
    private BigDecimal paymentAmount;
    private BigDecimal weight; // Add weight field

    public Integer getDeliveredUnits() {
        return deliveredUnits;
    }

    public BigDecimal getPaymentAmount() {
        return paymentAmount;
    }

    public BigDecimal getWeight() {
        return weight;
    }
}
