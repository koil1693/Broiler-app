package com.example.broiler.service;

import com.example.broiler.domain.Trip;
import com.example.broiler.repository.TripRepository;
import com.example.broiler.web.dto.DailyTripSummaryDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final TripRepository tripRepository;

    @Transactional(readOnly = true)
    public List<DailyTripSummaryDto> getDailyTripSummaries(LocalDate startDate, LocalDate endDate) {
        List<Trip> trips = tripRepository.findByTripDateBetween(startDate, endDate);

        Map<LocalDate, DailyTripSummaryDto> summaries = trips.stream()
                .collect(Collectors.groupingBy(
                        Trip::getTripDate,
                        Collectors.reducing(
                                // The initial accumulator's date is irrelevant as it will be replaced by the first trip's date
                                // The important part is that the combiner correctly handles the date.
                                new DailyTripSummaryDto(LocalDate.MIN, 0, 0, 0), // Initial accumulator (date will be replaced)
                                trip -> {
                                    int totalTrips = 1;
                                    int totalOrders = trip.getOrders() != null ? trip.getOrders().size() : 0;
                                    double totalUnits = trip.getOrders() != null ?
                                            trip.getOrders().stream()
                                                    .mapToDouble(order -> order.getAssignedUnits() != null ? order.getAssignedUnits() : 0)
                                                    .sum() : 0;
                                    return new DailyTripSummaryDto(trip.getTripDate(), totalTrips, totalOrders, totalUnits);
                                },
                                (s1, s2) -> new DailyTripSummaryDto(
                                        // Ensure the date is always taken from a valid source (the grouping key)
                                        s1.getDate() != null ? s1.getDate() : s2.getDate(),
                                        s1.getTotalTrips() + s2.getTotalTrips(),
                                        s1.getTotalOrders() + s2.getTotalOrders(),
                                        s1.getTotalUnits() + s2.getTotalUnits()
                                )
                        )
                ));
        
        // Ensure all dates are present for the full range, even if no trips occurred.
        // This requires generating all dates in the range and then mapping summaries.
        List<DailyTripSummaryDto> fullRangeSummaries = startDate.datesUntil(endDate.plusDays(1))
                .map(date -> summaries.getOrDefault(date, new DailyTripSummaryDto(date, 0, 0, 0)))
                .collect(Collectors.toList());

        return fullRangeSummaries.stream()
                .sorted((s1, s2) -> s1.getDate().compareTo(s2.getDate()))
                .collect(Collectors.toList());
    }
}
