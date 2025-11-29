package com.example.demo.controller;

import com.example.demo.dto.BookingHistoryDTO;
import com.example.demo.entity.SeatEntity;
import com.example.demo.service.BookingService;
import com.example.demo.repository.SeatRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;
    private final SeatRepository seatRepository;

    public BookingController(BookingService bookingService,
                             SeatRepository seatRepository) {
        this.bookingService = bookingService;
        this.seatRepository = seatRepository;
    }

    /**
     * BOOKING HISTORY
     * Called from user's Order History page.
     */
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<BookingHistoryDTO>> getBookingHistory(@PathVariable Long userId) {

        List<BookingHistoryDTO> history = bookingService.getBookingHistory(userId);

        return ResponseEntity.ok(history);
    }
}
