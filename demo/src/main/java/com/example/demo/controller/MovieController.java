package com.example.demo.controller;

import com.example.demo.entity.Movie;
import com.example.demo.entity.MovieStatus;
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
     public ResponseEntity<List<Movie>> searchMovies(@RequestParam(required = false)  String title, @RequestParam(required = false) String category,
    @RequestParam(required = false) String castMembers,  @RequestParam(required = false) String director, @RequestParam(required = false) String producer,
    @RequestParam(required = false) String synopsis, @RequestParam(required = false) String reviews, @RequestParam(required = false) String mpaaRating, @RequestParam(required = false) MovieStatus status) {
        List<Movie> movies = movieService.searchMovies(title, category, castMembers, director, producer, synopsis, reviews, mpaaRating, status);
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
    // UPDATE MOVIE
    @PutMapping("/{id}")
    public Movie updateMovie(@PathVariable Long id, @RequestBody Movie updatedMovie) {
        Movie movie = movieService.findById(id);
        if (movie == null) {
            throw new RuntimeException("Movie not found");
        }

        movie.setTitle(updatedMovie.getTitle());
        movie.setCategory(updatedMovie.getCategory());
        movie.setDirector(updatedMovie.getDirector());
        movie.setProducer(updatedMovie.getProducer());
        movie.setCastMembers(updatedMovie.getCastMembers());
        movie.setSynopsis(updatedMovie.getSynopsis());
        movie.setReviews(updatedMovie.getReviews());
        movie.setTrailer_picture(updatedMovie.getTrailer_picture());
        movie.setTrailer_video(updatedMovie.getTrailer_video());
        movie.setMpaaRating(updatedMovie.getMpaaRating());
        movie.setShowtime(updatedMovie.getShowtime());
        movie.setPoster_url(updatedMovie.getPoster_url());
        movie.setStatus(updatedMovie.getStatus());

        return movieService.save(movie);
    }

    // DELETE MOVIE
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMovie(@PathVariable Long id) {
        movieService.deleteById(id);
        return ResponseEntity.ok().build();
    }

}

