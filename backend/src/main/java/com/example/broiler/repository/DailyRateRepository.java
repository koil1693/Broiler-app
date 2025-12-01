package com.example.broiler.repository;

import com.example.broiler.domain.DailyRate;
import com.example.broiler.web.dto.HistoricalRateDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyRateRepository extends JpaRepository<DailyRate, Long> {
    Optional<DailyRate> findByDate(LocalDate date);

    @Query("SELECT new com.example.broiler.web.dto.HistoricalRateDto(dr.date, dr.rate) FROM DailyRate dr ORDER BY dr.date DESC")
    List<HistoricalRateDto> getCombinedRateHistory();
}
