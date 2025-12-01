package com.example.broiler.web.dto;

import com.example.broiler.domain.Order;
import com.example.broiler.domain.Trip;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DispatchDashboardDto {
    private List<Trip> plannedTrips;
    private List<Order> pendingOrders;
}