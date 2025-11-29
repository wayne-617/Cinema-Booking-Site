package com.example.demo.dto;

import java.time.LocalDateTime;

public record BookingReviewDTO(
        Long bookingId,
        String movieTitle,
        Double totalAmount,
        Integer lastFour,
        LocalDateTime purchaseDate
) {}
