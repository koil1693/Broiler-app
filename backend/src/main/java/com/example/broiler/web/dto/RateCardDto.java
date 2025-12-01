package com.example.broiler.web.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class RateCardDto {
    private BigDecimal baseRate;
    private List<VendorOffsetDto> vendorOffsets;

    public BigDecimal getBaseRate() {
        return baseRate;
    }

    public List<VendorOffsetDto> getVendorOffsets() {
        return vendorOffsets;
    }

    @Data
    public static class VendorOffsetDto {
        private Long vendorId;
        private String vendorName;
        private BigDecimal offset;

        public Long getVendorId() {
            return vendorId;
        }

        public String getVendorName() {
            return vendorName;
        }

        public BigDecimal getOffset() {
            return offset;
        }
    }
}
