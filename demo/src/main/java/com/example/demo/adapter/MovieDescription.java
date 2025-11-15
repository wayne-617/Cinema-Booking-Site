package com.example.demo.adapter;

import com.example.demo.entity.*;

/**
 * Adaptee wraps a Movie and knows how to present it as JSON text.
 */
public class MovieDescription implements JSONable {

    private final Movie movie;

    public MovieDescription(Movie movie) {
        this.movie = movie;
    }

    @Override
    public String convertJSONToText() {
        // Simple JSON-like output
        return """
               {
                 "title": "%s",
                 "category": "%s",
                 "director": "%s",
                 "producer": "%s",
                 "cast": "%s",
                 "synopsis": "%s",
                 "rating": %d,
                 "status": "%s",
               }
               """.formatted(
                   movie.getTitle(),
                   movie.getCategory(),
                   movie.getDirector(),
                   movie.getProducer(),
                   movie.getCastMembers(),
                   movie.getSynopsis(),
                   movie.getMpaaRating(),
                   movie.getStatus().toString()
               );
    }
}
