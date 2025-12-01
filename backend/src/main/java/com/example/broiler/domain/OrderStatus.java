package com.example.broiler.domain;

public enum OrderStatus {
    PENDING,  // Order has been created but not yet assigned to a trip
    ASSIGNED, // Order has been assigned to a trip
    DELIVERED // Order has been successfully delivered
}
