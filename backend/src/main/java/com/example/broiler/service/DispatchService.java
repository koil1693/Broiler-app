package com.example.broiler.service;

import com.example.broiler.domain.Order;
import com.example.broiler.domain.OrderStatus;
import com.example.broiler.domain.Trip;
import com.example.broiler.domain.Vendor;
import com.example.broiler.repository.OrderRepository;
import com.example.broiler.repository.TripRepository;
import com.example.broiler.repository.VendorRepository;
import com.example.broiler.web.dto.CreateOrderRequest;
import com.example.broiler.web.dto.DispatchDto;
import com.example.broiler.web.dto.UpdateOrderDetailsRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class DispatchService {

    private final OrderRepository orderRepository;
    private final TripRepository tripRepository;
    private final VendorRepository vendorRepository;

    @Transactional(readOnly = true)
    public DispatchDto getDispatchData(LocalDate date) {
        List<Order> pendingOrders = orderRepository.findByStatus(OrderStatus.PENDING);
        List<Trip> trips = tripRepository.findByTripDateWithOrdersAndVendors(date);
        return new DispatchDto(pendingOrders, trips);
    }

    @Transactional
    public Order createOrder(CreateOrderRequest request) {
        Vendor vendor = vendorRepository.findById(request.getVendorId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found"));

        Order order = Order.builder()
                .vendor(vendor)
                .assignedUnits(request.getAssignedUnits())
                .orderDate(request.getOrderDate())
                .status(OrderStatus.PENDING)
                .build();
        return orderRepository.save(order);
    }

    @Transactional
    public void assignOrdersToTrip(Long tripId, List<Long> orderIds) {
        if (orderIds == null || orderIds.isEmpty()) {
            return;
        }
        
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Trip not found"));

        List<Order> ordersToAssign = orderRepository.findAllById(orderIds);
        List<Order> updatedOrders = new ArrayList<>();

        for (Order order : ordersToAssign) {
            if (order.getStatus() == OrderStatus.PENDING) {
                order.setTrip(trip);
                order.setStatus(OrderStatus.ASSIGNED);
                updatedOrders.add(order);
            } else if (order.getStatus() == OrderStatus.ASSIGNED && !Objects.equals(order.getTrip().getId(), tripId)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order " + order.getId() + " is already assigned to a different trip.");
            }
        }
        
        orderRepository.saveAll(updatedOrders);

        if (trip.getOrders() == null) {
            trip.setOrders(new ArrayList<>());
        }
        trip.getOrders().addAll(updatedOrders);
    }

    @Transactional
    public Order unassignOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (order.getStatus() == OrderStatus.ASSIGNED) {
            if (order.getTrip() != null && order.getTrip().getOrders() != null) {
                order.getTrip().getOrders().remove(order);
            }
            order.setTrip(null);
            order.setStatus(OrderStatus.PENDING);
            return orderRepository.save(order);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Order " + orderId + " cannot be unassigned as it is not in an ASSIGNED state.");
        }
    }

    @Transactional
    public Order updateOrderDetails(Long orderId, UpdateOrderDetailsRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        if (request.getDeliveredUnits() != null) {
            order.setDeliveredUnits(request.getDeliveredUnits());
        }
        if (request.getPaymentAmount() != null) {
            order.setPaymentAmount(request.getPaymentAmount());
        }
        if (request.getWeight() != null) {
            order.setWeight(request.getWeight());
        }

        if (order.getDeliveredUnits() != null && order.getPaymentAmount() != null) {
            order.setStatus(OrderStatus.DELIVERED);
        }
        
        return orderRepository.save(order);
    }
}
