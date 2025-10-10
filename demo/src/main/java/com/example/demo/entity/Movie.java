package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "movie")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long movie_id;

    private String title;
    private String director;
    private String poster_url;

    public Long getMovie_id() { return movie_id; }
    public void setMovie_id(Long movie_id) { this.movie_id = movie_id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getPoster_url() { return poster_url; }
    public void setPoster_url(String poster_url) { this.poster_url = poster_url; }
}