package com.example.broiler.web;

import com.example.broiler.service.RateService;
import com.example.broiler.web.dto.RateCardDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rates")
@RequiredArgsConstructor
public class RateController {

    private final RateService rateService;

    @GetMapping("/card")
    public ResponseEntity<RateCardDto> getRateCard() {
        return ResponseEntity.ok(rateService.getRateCard());
    }

    @PostMapping("/card")
    public ResponseEntity<Void> saveRateCard(@RequestBody RateCardDto rateCard) {
        rateService.saveRateCard(rateCard);
        return ResponseEntity.ok().build();
    }
}
