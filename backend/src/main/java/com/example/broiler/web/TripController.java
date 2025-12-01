package com.example.broiler.web;

import com.example.broiler.domain.Trip;
import com.example.broiler.service.TripService;
import com.example.broiler.web.dto.CreateTripRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Trip> createTrip(@RequestBody CreateTripRequest dto) {
        Trip createdTrip = tripService.createTrip(dto);
        return ResponseEntity.ok(createdTrip);
    }

    @GetMapping("/today")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Trip>> getTodaysTrips() {
        List<Trip> trips = tripService.getTodaysTrips();
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/recent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Trip>> getRecentTrips() {
        List<Trip> trips = tripService.getRecentTrips();
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @tripSecurity.isDriverForTrip(authentication.name, #id)")
    public ResponseEntity<Trip> getTripDetails(@PathVariable("id") Long id, Authentication authentication) {
        Trip trip = tripService.getTripDetails(id);
        return ResponseEntity.ok(trip);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Trip> updateTrip(@PathVariable("id") Long id, @RequestBody CreateTripRequest dto) {
        Trip updatedTrip = tripService.updateTrip(id, dto);
        return ResponseEntity.ok(updatedTrip);
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('ADMIN') or @tripSecurity.isDriverForTrip(authentication.name, #id)")
    public ResponseEntity<Trip> closeTrip(@PathVariable("id") Long id, Authentication authentication) {
        Trip closedTrip = tripService.closeTrip(id);
        return ResponseEntity.ok(closedTrip);
    }
}
