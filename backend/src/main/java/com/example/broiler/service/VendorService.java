package com.example.broiler.service;

import com.example.broiler.domain.Vendor;
import com.example.broiler.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;

    public List<Vendor> findAll() {
        return vendorRepository.findAll();
    }

    public Vendor create(Vendor vendor) {
        return vendorRepository.save(vendor);
    }
}
