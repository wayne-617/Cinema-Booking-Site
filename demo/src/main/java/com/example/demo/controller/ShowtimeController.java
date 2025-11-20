package com.example.demo.controller;

import com.example.demo.dto.ShowtimeRequest;
import com.example.demo.entity.ShowtimeEntity;
import com.example.demo.service.ShowtimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    public ShowtimeController(ShowtimeService showtimeService) {
        this.showtimeService = showtimeService;
    }

    // ✅ POST: create new showtime
    @PostMapping
    public ShowtimeEntity createShowtime(
            @RequestParam Long movieId,
            @RequestBody ShowtimeEntity showtime
    ) {
        return showtimeService.createShowtime(movieId, showtime);
    }

    // ✅ GET: all showtimes (with optional date filters)
    @GetMapping
    public List<ShowtimeRequest> getShowtimes(
            @RequestParam(required = false) LocalDate start,
            @RequestParam(required = false) LocalDate end
    ) {
        if (start != null && end != null) {
            return showtimeService.getShowtimesBetweenDates(start, end);
        } else {
            LocalDate now = LocalDate.now();
            return showtimeService.getShowtimesBetweenDates(now.minusDays(15), now.plusDays(15));
        }
    }

    // ✅ FIXED: get showtimes by movie (delegates to service)
    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ShowtimeEntity>> getShowtimesByMovie(@PathVariable Long movieId) {
        List<ShowtimeEntity> showtimes = showtimeService.getShowtimesByMovie(movieId);
        return ResponseEntity.ok(showtimes);
    }

    // ✅ DELETE: delete showtime
    @DeleteMapping("/{id}")
    public String deleteShowtime(@PathVariable Long id) {
        showtimeService.deleteShowtime(id);
        return "Showtime " + id + " deleted successfully.";
    }
}
