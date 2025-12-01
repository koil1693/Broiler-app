package com.example.broiler.security;

import com.example.broiler.domain.Trip;
import com.example.broiler.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service("tripSecurity")
@RequiredArgsConstructor
public class TripSecurityService {

    private final TripRepository tripRepository;

    public boolean isDriverForTrip(String username, Long tripId) {
        return tripRepository.findById(tripId)
                .map(Trip::getDriver)
                .map(driver -> driver.getUsername().equals(username))
                .orElse(false);
    }
}
