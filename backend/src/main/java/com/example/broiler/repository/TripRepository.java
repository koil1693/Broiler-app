package com.example.broiler.repository;

import com.example.broiler.domain.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TripRepository extends JpaRepository<Trip, Long> {

    @Query("SELECT t FROM Trip t LEFT JOIN FETCH t.orders o LEFT JOIN FETCH o.vendor LEFT JOIN FETCH t.driver WHERE t.tripDate = :date")
    List<Trip> findByTripDateWithOrdersAndVendors(@Param("date") LocalDate date);

    @Query("SELECT t FROM Trip t LEFT JOIN FETCH t.orders o LEFT JOIN FETCH o.vendor LEFT JOIN FETCH t.driver d WHERE t.tripDate = :date AND d.username = :username")
    List<Trip> findByTripDateAndDriverUsername(@Param("date") LocalDate date, @Param("username") String username);

    @Query("SELECT t FROM Trip t LEFT JOIN FETCH t.orders o LEFT JOIN FETCH o.vendor LEFT JOIN FETCH t.driver WHERE t.id = :id")
    Optional<Trip> findByIdWithOrdersAndVendorsAndDriver(@Param("id") Long id);

    List<Trip> findByTripDate(LocalDate date);

    List<Trip> findByTripDateBetween(LocalDate startDate, LocalDate endDate);

    List<Trip> findByDriverUsernameOrderByTripDateDesc(String username);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "driver", "orders", "orders.vendor" })
    List<Trip> findTop10ByOrderByTripDateDescIdDesc();
}
