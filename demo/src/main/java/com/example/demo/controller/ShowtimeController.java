package com.example.demo.controller;

import com.example.demo.dto.ShowtimeRequest;
import com.example.demo.entity.ShowtimeEntity;
import com.example.demo.service.ShowtimeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.repository.ShowtimeRepository;



import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/showtimes")
@CrossOrigin(origins = "http://localhost:3000")
public class ShowtimeController {

    private final ShowtimeService showtimeService;
    private final ShowtimeRepository showtimeRepository;

    public ShowtimeController(ShowtimeService showtimeService, ShowtimeRepository showtimeRepository) {
        this.showtimeService = showtimeService;
        this.showtimeRepository = showtimeRepository;
    }

    @PostMapping
    public ShowtimeEntity createShowtime(
            @RequestParam Long movieId,
            @RequestBody ShowtimeEntity showtime
    ) {
        return showtimeService.createShowtime(movieId, showtime);
    }

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

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<ShowtimeEntity>> getShowtimesByMovie(@PathVariable Long movieId) {
        List<ShowtimeEntity> showtimes = showtimeService.getShowtimesByMovie(movieId);
        return ResponseEntity.ok(showtimes);
    }

    @DeleteMapping("/{id}")
    public String deleteShowtime(@PathVariable Long id) {
        showtimeService.deleteShowtime(id);
        return "Showtime " + id + " deleted successfully.";
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateShowtime(
            @PathVariable Long id,
            @RequestBody ShowtimeEntity incoming
    ) {
        ShowtimeEntity s = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        s.setShowDate(incoming.getShowDate());
        s.setShowTime(incoming.getShowTime());

        showtimeRepository.save(s);
        return ResponseEntity.ok(s);
    }

   @GetMapping("/showtime/{id}")
public ResponseEntity<?> getShowtimeDetails(@PathVariable Long id) {
    ShowtimeEntity show = showtimeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Showtime not found"));

    Map<String, Object> response = new HashMap<>();
    response.put("showtimeId", id);
    response.put("movieId", show.getMovie().getMovieId());
    response.put("title", show.getMovie().getTitle());
    response.put("ticketPrice", show.getMovie().getTicketPrice());

    return ResponseEntity.ok(response);
}

}
