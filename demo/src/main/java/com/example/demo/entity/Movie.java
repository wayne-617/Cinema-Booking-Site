package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "movie")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long movie_id;

    private String title;

    // Matches SQL "category"
    private String category;

    private String director;
    private String producer;

    // Use @Column to handle SQL reserved words or naming mismatches
    @Column(name = "cast")
    private String castMembers;

    private String synopsis;
    private String reviews;

    private String trailer_picture;
    private String trailer_video;

    @Column(name = "mpaa_rating")
    private String mpaaRating;

    private MovieStatus status;

    private LocalDateTime showtime;
    private String poster_url;
    
    public Long getMovie_id() { return movie_id; }
    public void setMovie_id(Long movie_id) { this.movie_id = movie_id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getProducer() { return producer; }
    public void setProducer(String producer) { this.producer = producer; }

    public String getCastMembers() { return castMembers; }
    public void setCastMembers(String castMembers) { this.castMembers = castMembers; }

    public String getSynopsis() { return synopsis; }
    public void setSynopsis(String synopsis) { this.synopsis = synopsis; }

    public String getReviews() { return reviews; }
    public void setReviews(String reviews) { this.reviews = reviews; }

    public String getTrailer_picture() { return trailer_picture; }
    public void setTrailer_picture(String trailer_picture) { this.trailer_picture = trailer_picture; }

    public String getTrailer_video() { return trailer_video; }
    public void setTrailer_video(String trailer_video) { this.trailer_video = trailer_video; }

    public String getMpaaRating() { return mpaaRating; }
    public void setMpaaRating(String mpaaRating) { this.mpaaRating = mpaaRating; }

    public MovieStatus getStatus() { return status; }
    public void setStatus(MovieStatus status) { this.status = status; } 

    public LocalDateTime getShowtime() { return showtime; }
    public void setShowtime(LocalDateTime showtime) { this.showtime = showtime; }

    public String getPoster_url() { return poster_url; }
    public void setPoster_url(String poster_url) { this.poster_url = poster_url; }





}