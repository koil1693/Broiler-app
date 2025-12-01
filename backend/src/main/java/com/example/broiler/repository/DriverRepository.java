package com.example.broiler.repository;

import com.example.broiler.domain.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.time.LocalDate;
import java.util.List;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    
    Optional<Driver> findByUsername(String username);
    
    
    
}
