package com.example.demo.controller;

import com.example.demo.entity.SeatEntity;
import com.example.demo.entity.ShowtimeEntity;
import com.example.demo.repository.SeatRepository;
import com.example.demo.repository.ShowtimeRepository;
import com.example.demo.service.SeatService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/seats")
@CrossOrigin(origins = "http://localhost:3000")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    // 🎟️ Get seats for a showtime
    @GetMapping("/showtime/{showtimeId}")
    public List<SeatEntity> getSeatsForShowtime(@PathVariable Long showtimeId) {
        return seatService.getSeatsForShowtime(showtimeId);
    }

    // (Optional) Reserve seats without checkout
    @PostMapping("/book")
    public String bookSeats(@RequestBody List<Long> seatIds) {
        seatService.bookSeats(seatIds);
        return "Seats booked successfully!";
    }
    
}

