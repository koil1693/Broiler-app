package com.example.broiler.web;

import com.example.broiler.domain.Driver;
import com.example.broiler.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverRepository driverRepository;

    @GetMapping
    public ResponseEntity<List<Driver>> getAllDrivers() {
        return ResponseEntity.ok(driverRepository.findAll());
    }

    @org.springframework.web.bind.annotation.PostMapping
    public ResponseEntity<Driver> createDriver(@org.springframework.web.bind.annotation.RequestBody Driver driver) {
        return ResponseEntity.ok(driverRepository.save(driver));
    }
}
