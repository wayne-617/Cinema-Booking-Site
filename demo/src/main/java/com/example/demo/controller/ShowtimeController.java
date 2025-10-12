package com.example.demo.controller;

import com.example.demo.dto.ShowtimeRequest;
import com.example.demo.repository.ShowtimeRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowtimeController {

    private final ShowtimeRepository showtimeRepository;

    public ShowtimeController(ShowtimeRepository showtimeRepository) {
        this.showtimeRepository = showtimeRepository;
    }

      @GetMapping
    public List<ShowtimeRequest> getShowtimes(
            @RequestParam(defaultValue = "2025-10-14") LocalDate start,
            @RequestParam(defaultValue = "2025-10-18") LocalDate end
    ) {
        return showtimeRepository.findShowtimesBetweenDates(start, end);
    }
}