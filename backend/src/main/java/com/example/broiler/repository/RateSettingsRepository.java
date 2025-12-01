package com.example.broiler.repository;

import com.example.broiler.domain.RateSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.time.LocalDate;
import java.util.List;

public interface RateSettingsRepository extends JpaRepository<RateSettings, Long> {
    
    
    
    Optional<RateSettings> findBySettingKey(String settingKey);
    
}
