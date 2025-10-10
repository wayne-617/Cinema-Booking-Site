package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "movie")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long movie_id;

    private String title;
    private String genre;
    private String cast;
    private String director;
    private String producer;
    private String synopsis;
    private String poster_url;
    private String reviews;
    private String rating;

    
    public Long getMovie_id() { return movie_id; }
    public void setMovie_id(Long movie_id) { this.movie_id = movie_id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getPoster_url() { return poster_url; }
    public void setPoster_url(String poster_url) { this.poster_url = poster_url; }
}