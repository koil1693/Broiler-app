package com.example.broiler.web;

import com.example.broiler.domain.Order;
import com.example.broiler.service.DispatchService;
import com.example.broiler.web.dto.AssignOrdersRequest;
import com.example.broiler.web.dto.CreateOrderRequest;
import com.example.broiler.web.dto.DispatchDto;
import com.example.broiler.web.dto.UpdateOrderDetailsRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/dispatch")
@RequiredArgsConstructor
public class DispatchController {

    private final DispatchService dispatchService;

    @GetMapping
    public ResponseEntity<DispatchDto> getDispatchData(@RequestParam(value = "date", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate queryDate = (date == null) ? LocalDate.now() : date;
        return ResponseEntity.ok(dispatchService.getDispatchData(queryDate));
    }

    @PostMapping("/orders")
    public ResponseEntity<Order> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return ResponseEntity.ok(dispatchService.createOrder(request));
    }

    @PostMapping("/assign-orders")
    public ResponseEntity<Void> assignOrdersToTrip(@RequestBody AssignOrdersRequest request) {
        dispatchService.assignOrdersToTrip(request.getTripId(), request.getOrderIds());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/orders/{orderId}")
    public ResponseEntity<Order> updateOrderDetails(@PathVariable("orderId") Long orderId, @RequestBody UpdateOrderDetailsRequest request) {
        return ResponseEntity.ok(dispatchService.updateOrderDetails(orderId, request));
    }

    @PutMapping("/orders/{orderId}/unassign")
    public ResponseEntity<Order> unassignOrder(@PathVariable("orderId") Long orderId) {
        return ResponseEntity.ok(dispatchService.unassignOrder(orderId));
    }
}
