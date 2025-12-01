package com.example.broiler.service;

import com.example.broiler.domain.*;
import com.example.broiler.repository.*;
import com.example.broiler.web.dto.CreateTripRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final DriverRepository driverRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public Trip createTrip(CreateTripRequest dto) {
        Driver driver = driverRepository.findById(dto.getDriverId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Driver not found with id: " + dto.getDriverId()));

        Trip trip = Trip.builder()
                .routeName(dto.getRouteName())
                .driver(driver)
                .tripDate(dto.getTripDate())
                .status("PLANNED")
                .loadedWeight(dto.getLoadedWeight())
                .stockWeight(dto.getLoadedWeight()) // Initially stock is full load
                .build();
        return tripRepository.save(trip);
    }

    @Transactional(readOnly = true)
    public List<Trip> getTodaysTrips() {
        return tripRepository.findByTripDate(LocalDate.now());
    }

    @Transactional(readOnly = true)
    public List<Trip> getTodaysTripsWithDetails() {
        return tripRepository.findByTripDateWithOrdersAndVendors(LocalDate.now());
    }

    @Transactional(readOnly = true)
    public List<Trip> getTodaysTripsForDriver(String username) {
        return tripRepository.findByTripDateAndDriverUsername(LocalDate.now(), username);
    }

    @Transactional(readOnly = true)
    public Trip getTripDetails(Long tripId) {
        return tripRepository.findByIdWithOrdersAndVendorsAndDriver(tripId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Trip not found: " + tripId));
    }

    @Transactional
    public Trip updateTrip(Long tripId, CreateTripRequest dto) {
        Trip trip = getTripDetails(tripId);

        if (dto.getLoadedWeight() != null) {
            trip.setLoadedWeight(dto.getLoadedWeight());
            // Recalculate stock immediately
            BigDecimal totalDeliveredWeight = trip.getOrders().stream()
                    .map(Order::getWeight)
                    .filter(java.util.Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            trip.setStockWeight(trip.getLoadedWeight().subtract(totalDeliveredWeight));
        }

        if (dto.getRouteName() != null) {
            trip.setRouteName(dto.getRouteName());
        }

        // We generally don't update driver or date for active trips easily, but can be
        // added if needed.

        return tripRepository.save(trip);
    }

    @Transactional
    public Trip closeTrip(Long tripId) {
        Trip t = getTripDetails(tripId);
        t.setStatus("COMPLETED");

        if (t.getOrders() != null) {
            for (Order order : t.getOrders()) {
                if (order.getStatus() != OrderStatus.DELIVERED) {
                    order.setStatus(OrderStatus.DELIVERED);
                    if (order.getDeliveredUnits() == null)
                        order.setDeliveredUnits(0);
                    if (order.getPaymentAmount() == null)
                        order.setPaymentAmount(BigDecimal.ZERO);
                    orderRepository.save(order);
                }
            }
        }

        // Recalculate stock weight
        if (t.getLoadedWeight() != null) {
            BigDecimal totalDeliveredWeight = t.getOrders().stream()
                    .map(Order::getWeight)
                    .filter(java.util.Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            t.setStockWeight(t.getLoadedWeight().subtract(totalDeliveredWeight));
        }

        return tripRepository.save(t);
    }

    @Transactional(readOnly = true)
    public List<Trip> getTripHistoryForDriver(String username) {
        return tripRepository.findByDriverUsernameOrderByTripDateDesc(username);
    }

    @Transactional(readOnly = true)
    public List<Trip> getRecentTrips() {
        return tripRepository.findTop10ByOrderByTripDateDescIdDesc();
    }
}
