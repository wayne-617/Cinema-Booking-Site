package com.example.demo.service;

import com.example.demo.dto.ShowtimeRequest;
import com.example.demo.entity.Movie;
import com.example.demo.entity.SeatEntity;
import com.example.demo.entity.ShowtimeEntity;
import com.example.demo.repository.MovieRepository;
import com.example.demo.repository.SeatRepository;
import com.example.demo.repository.ShowtimeRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

@Service
public class ShowtimeService {

     private final ShowtimeRepository showtimeRepository;
    private final MovieRepository movieRepository;
    private final SeatService seatService;
    

    public ShowtimeService(
            ShowtimeRepository showtimeRepository,
            MovieRepository movieRepository,
            SeatService seatService
    ) {
        this.showtimeRepository = showtimeRepository;
        this.movieRepository = movieRepository;
        this.seatService = seatService;
    }

    public ShowtimeEntity createShowtime(Long movieId, ShowtimeEntity showtime) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        showtime.setMovie(movie);
        ShowtimeEntity savedShowtime = showtimeRepository.save(showtime);

        seatService.generateSeatsForShowtime(savedShowtime.getShowtimeId());    

        return savedShowtime;
    }
 
    public List<ShowtimeEntity> getAllShowtimes() {
        return (List<ShowtimeEntity>) showtimeRepository.findAll();
    }


    public List<ShowtimeRequest> getShowtimesBetweenDates(LocalDate start, LocalDate end) {
        return showtimeRepository.findShowtimesBetweenDates(start, end);
    }

    public List<ShowtimeEntity> getShowtimesByMovie(Long movieId) {
        return showtimeRepository.findByMovie_MovieId(movieId);
    }


    /**
     * Delete a showtime by ID.
     */
    public void deleteShowtime(Long id) {
        if (!showtimeRepository.existsById(id)) {
            throw new RuntimeException("Showtime not found with ID: " + id);
        }
        showtimeRepository.deleteById(id);
        System.out.println("Showtime " + id + " deleted successfully.");
    }

    public ResponseEntity<?> updateShowtime(Long id, ShowtimeEntity updated) {
        ShowtimeEntity s = showtimeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Showtime not found"));

        s.setShowDate(updated.getShowDate());
        s.setShowTime(updated.getShowTime());

        showtimeRepository.save(s);
        return ResponseEntity.ok(s);
    }

}
