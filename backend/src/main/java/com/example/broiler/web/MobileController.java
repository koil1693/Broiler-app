package com.example.broiler.web;

import com.example.broiler.domain.Trip;
import com.example.broiler.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mobile")
@RequiredArgsConstructor
@PreAuthorize("hasRole('DRIVER')") // Class-level security: only drivers can access these endpoints
public class MobileController {

    private final TripService tripService;

    @GetMapping("/trips/today")
    public ResponseEntity<List<Trip>> getTodaysTripsForMobile(Authentication authentication) {
        String username = authentication.getName();
        List<Trip> trips = tripService.getTodaysTripsForDriver(username);
        return ResponseEntity.ok(trips);
    }
}
