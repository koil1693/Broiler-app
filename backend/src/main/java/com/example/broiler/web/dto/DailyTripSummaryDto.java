package com.example.broiler.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DailyTripSummaryDto {
    private LocalDate date;
    private int totalTrips;
    private int totalOrders;
    private double totalUnits;
}
