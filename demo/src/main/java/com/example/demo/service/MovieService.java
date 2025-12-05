package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.example.demo.adapter.FormatAdapter;
import com.example.demo.adapter.MovieDescription;
import com.example.demo.entity.Movie;
import com.example.demo.entity.MovieStatus;
import com.example.demo.repository.MovieRepository;

@Service
public class MovieService  {

    @Autowired
    private MovieRepository movieRepository;
    
    public MovieService(MovieRepository movieRepository) {
        this.movieRepository = movieRepository;
    }

    public Movie createMovie(String title, String director, Long movieId, String poster_url, String cast, String genre, String producer, String rating, String reviews, String synopsis){
        Movie movie = new Movie();
        
        movie.setTitle(title);
        movie.setCategory(genre);
        movie.setDirector(director);
        movie.setMovieId(movieId);
        movie.setTrailer_picture(poster_url);
        movie.setCastMembers(cast);
        movie.setProducer(producer);
        movie.setMpaaRating(rating);
        movie.setReviews(reviews);
        movie.setSynopsis(synopsis);

        return movieRepository.save(movie);

    }
   
    public Movie updateMovie(String title, String director, Long movieId, String poster_url, String cast, String genre, String producer, String rating, String reviews, String synopsis) {

        Movie movie = movieRepository.findByTitle(title)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        movie.setTitle(title);
        movie.setCategory(genre);
        movie.setDirector(director);
        movie.setMovieId(movieId);
        movie.setTrailer_picture(poster_url);
        movie.setCastMembers(cast);
        movie.setProducer(producer);
        movie.setMpaaRating(rating);
        movie.setReviews(reviews);
        movie.setSynopsis(synopsis);

        return movieRepository.save(movie);
        
    }

    public Movie save(Movie movie) {
        return movieRepository.save(movie);              // from JpaRepository
    }

    public List<Movie> findAll() {
        return movieRepository.findAll();                // from JpaRepository
    }

    public Movie findById(Long id) {
        return movieRepository.findById(id).orElse(null); // from JpaRepository
    }

    public List<Movie> searchMovies(String title, String category, String castMembers, String director, String producer,
        String synopsis, String mpaaRating, String reviews, MovieStatus status
    ) {
        // custom query you defined
        List<Movie> result = null;
        if (title != null && !title.isEmpty()) {
        result = movieRepository.findByTitleContainingIgnoreCase(title);
        } 
        
        if (category != null && !category.isEmpty()) {
            result = movieRepository.findByCategoryContainingIgnoreCase(category);
        }

        if(castMembers != null && !castMembers.isEmpty()) {
            result = movieRepository.findBycastMembersContainingIgnoreCase(castMembers);
        }

        if(director != null && !director.isEmpty()) {
            result = movieRepository.findByDirectorContainingIgnoreCase(director);
        }

         if(producer != null && !producer.isEmpty()) {
            result = movieRepository.findByProducerContainingIgnoreCase(producer);
        }

        if(synopsis != null && !synopsis.isEmpty()) {
            result = movieRepository.findBySynopsisContainingIgnoreCase(synopsis);
        }

        if(reviews != null && !reviews.isEmpty()) {
            result = movieRepository.findByReviewsContainingIgnoreCase(reviews);
        }

        if(mpaaRating != null && !mpaaRating.isEmpty()) {
            result = movieRepository.findBympaaRatingContainingIgnoreCase(mpaaRating);
        }

        if(status != null) {
            result = movieRepository.findByStatus(status);
        }
        
        

        
        return result;
    }

    public String getMovieDetailsFormatted(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Movie not found: " + id));

        // Adaptee MovieReview implements JSONable
        MovieDescription description = new MovieDescription(movie);

        // Adapter hides how JSON is produced
        FormatAdapter adapter = new FormatAdapter(description);

        return adapter.returnDetails();
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    public Movie getMovieByTitle(String title) {
        return movieRepository.findByTitle(title)
          .orElseThrow(() -> new RuntimeException("Movie not found"));

    }

     public Movie getMovieById(Long id) {
        return movieRepository.findById(id)
          .orElseThrow(() -> new RuntimeException("Movie not found"));

    }

    public void deleteById(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Movie not found");
        }
        movieRepository.deleteById(id);
    }

    public void deleteMovie(String title) {
        movieRepository.deleteAll();
    }

}