package com.example.demo.controller;

import com.example.demo.entity.Movie;
import com.example.demo.repository.MovieRepository;
import com.example.demo.service.MovieService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;



@RestController
@RequestMapping("/api/movies")
@CrossOrigin(origins = "http://localhost:3000")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }
    @PostMapping("/addMovies")
    public Movie addMovie(@RequestBody Movie movie) {  
        return movieService.save(movie);
    }
    
    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.findAll();
    }

    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Long id) {
        return movieService.findById(id);
    }

    @GetMapping("/search")
     public ResponseEntity<List<Movie>> searchMovies(@RequestParam String query) {
        List<Movie> movies = movieService.searchMovies(query);
        return ResponseEntity.ok(movies);
    }

    /**
     * Returns formatted details for a movie using the Adapter pattern.
     * Example: GET /api/movies/5/details
     */
    @GetMapping("/{id}/details")
    public ResponseEntity<String> getMovieDetails(@PathVariable Long id) {
        String details = movieService.getMovieDetailsFormatted(id);
        return ResponseEntity.ok(details);
    }
}

