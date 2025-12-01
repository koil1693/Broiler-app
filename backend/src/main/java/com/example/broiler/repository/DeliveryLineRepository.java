package com.example.broiler.repository;

import com.example.broiler.domain.DeliveryLine;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.time.LocalDate;
import java.util.List;

public interface DeliveryLineRepository extends JpaRepository<DeliveryLine, Long> {
    List<DeliveryLine> findByStopId(Long stopId);
}
