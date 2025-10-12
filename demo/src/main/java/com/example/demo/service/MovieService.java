package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;


import com.example.demo.entity.Movie;
import com.example.demo.repository.MovieRepository;

@Service
public class MovieService  {

    @Autowired
    private MovieRepository movieRepository;
    

    public Movie createMovie(String title, String director, Long movie_id, String poster_url, String cast, String genre, String producer, String rating, String reviews, String synopsis){
        Movie movie = new Movie();
        
        movie.setTitle(title);
        movie.setCategory(genre);
        movie.setDirector(director);
        movie.setTrailer_picture(poster_url);
        movie.setCastMembers(cast);
        movie.setProducer(producer);
        movie.setMpaaRating(rating);
        movie.setReviews(reviews);
        movie.setSynopsis(synopsis);

        return movieRepository.save(movie);

    }
   
    public Movie updateMovie(String title, String director, Long movie_id, String poster_url, String cast, String genre, String producer, String rating, String reviews, String synopsis) {

        Movie movie = movieRepository.findByTitle(title)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        movie.setTitle(title);
        movie.setCategory(genre);
        movie.setDirector(director);
        movie.setTrailer_picture(poster_url);
        movie.setCastMembers(cast);
        movie.setProducer(producer);
        movie.setMpaaRating(rating);
        movie.setReviews(reviews);
        movie.setSynopsis(synopsis);

        return movieRepository.save(movie);
        
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

    public void deleteMovie(String title) {
        movieRepository.deleteAll();
    }
}