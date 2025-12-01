package com.example.broiler.service;

import com.example.broiler.domain.DailyRate;
import com.example.broiler.domain.Vendor;
import com.example.broiler.repository.DailyRateRepository;
import com.example.broiler.repository.VendorRepository;
import com.example.broiler.web.dto.RateCardDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RateService {

    private final DailyRateRepository dailyRateRepository;
    private final VendorRepository vendorRepository;

    @Transactional(readOnly = true)
    public RateCardDto getRateCard() {
        RateCardDto rateCard = new RateCardDto();
        
        BigDecimal baseRate = dailyRateRepository.findByDate(LocalDate.now())
                .map(DailyRate::getRate)
                .orElse(BigDecimal.ZERO);
        rateCard.setBaseRate(baseRate);

        List<RateCardDto.VendorOffsetDto> vendorOffsets = vendorRepository.findAll().stream()
                .map(vendor -> {
                    RateCardDto.VendorOffsetDto dto = new RateCardDto.VendorOffsetDto();
                    dto.setVendorId(vendor.getId());
                    dto.setVendorName(vendor.getName());
                    dto.setOffset(vendor.getRateOffset() != null ? vendor.getRateOffset() : BigDecimal.ZERO);
                    return dto;
                })
                .collect(Collectors.toList());
        rateCard.setVendorOffsets(vendorOffsets);

        return rateCard;
    }

    @Transactional
    public void saveRateCard(RateCardDto rateCard) {
        setDailyRate(LocalDate.now(), rateCard.getBaseRate());

        for (RateCardDto.VendorOffsetDto vendorOffset : rateCard.getVendorOffsets()) {
            setVendorOffset(vendorOffset.getVendorId(), vendorOffset.getOffset());
        }
    }

    @Transactional
    public DailyRate setDailyRate(LocalDate date, BigDecimal rate) {
        DailyRate rateToSave = dailyRateRepository.findByDate(date)
                .map(existingRate -> {
                    existingRate.setRate(rate);
                    return existingRate;
                })
                .orElseGet(() -> DailyRate.builder().date(date).rate(rate).build());
        return dailyRateRepository.save(rateToSave);
    }

    @Transactional
    public Vendor setVendorOffset(Long vendorId, BigDecimal offset) {
        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found: " + vendorId));
        vendor.setRateOffset(offset);
        return vendorRepository.save(vendor);
    }

    @Transactional(readOnly = true)
    public BigDecimal getEffectiveRate(Long vendorId, LocalDate date) {
        DailyRate dailyRate = dailyRateRepository.findByDate(date)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No base rate set for date: " + date));

        Vendor vendor = vendorRepository.findById(vendorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found: " + vendorId));
        
        BigDecimal baseRate = dailyRate.getRate();
        BigDecimal offset = vendor.getRateOffset() != null ? vendor.getRateOffset() : BigDecimal.ZERO;
        return baseRate.add(offset);
    }
}
