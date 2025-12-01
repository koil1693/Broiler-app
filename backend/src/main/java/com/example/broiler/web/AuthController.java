package com.example.broiler.web;

import com.example.broiler.domain.Admin;
import com.example.broiler.domain.Driver;
import com.example.broiler.repository.AdminRepository;
import com.example.broiler.repository.DriverRepository;
import com.example.broiler.security.jwt.JwtUtils;
import com.example.broiler.web.dto.AuthDtos;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AdminRepository adminRepository;
    private final DriverRepository driverRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;

    public AuthController(AdminRepository adminRepository, DriverRepository driverRepository, PasswordEncoder encoder, JwtUtils jwtUtils){
        this.adminRepository = adminRepository;
        this.driverRepository = driverRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Validated @RequestBody AuthDtos.LoginRequest req){
        logger.info("Login attempt for username: {}", req.getUsername());

        // 1. Try to find user as an Admin
        Optional<Admin> adminOpt = adminRepository.findByUsername(req.getUsername());
        if (adminOpt.isPresent()) {
            logger.info("Found user in Admin repository.");
            Admin admin = adminOpt.get();
            boolean passwordMatches = encoder.matches(req.getPassword(), admin.getPassword());
            logger.info("Admin password match result: {}", passwordMatches);
            if (passwordMatches) {
                String token = jwtUtils.generateJwtToken(admin.getUsername(), "ROLE_ADMIN");
                return ResponseEntity.ok(new AuthDtos.JwtResponse(token));
            }
        } else {
            logger.info("User not found in Admin repository.");
        }

        // 2. If not an Admin, try to find user as a Driver
        Optional<Driver> driverOpt = driverRepository.findByUsername(req.getUsername());
        if (driverOpt.isPresent()) {
            logger.info("Found user in Driver repository.");
            Driver driver = driverOpt.get();
            boolean passwordMatches = encoder.matches(req.getPassword(), driver.getPassword());
            logger.info("Driver password match result: {}", passwordMatches);
            if (passwordMatches) {
                String token = jwtUtils.generateJwtToken(driver.getUsername(), "ROLE_DRIVER");
                return ResponseEntity.ok(new AuthDtos.JwtResponse(token));
            }
        } else {
            logger.info("User not found in Driver repository.");
        }

        logger.warn("Authentication failed for username: {}", req.getUsername());
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
