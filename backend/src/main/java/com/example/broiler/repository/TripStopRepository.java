package com.example.broiler.repository;

import com.example.broiler.domain.TripStop;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.time.LocalDate;
import java.util.List;

public interface TripStopRepository extends JpaRepository<TripStop, Long> {
    List<TripStop> findByTripId(Long tripId);
}
