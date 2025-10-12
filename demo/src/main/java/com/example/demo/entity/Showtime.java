package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "showtimes")
public class Showtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "showtime_id")
    private Long showtimeId;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Column(name = "show_date", nullable = false)
    private java.sql.Date showDate;

    @Column(name = "show_time", nullable = false)
    private java.sql.Time showTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", insertable = false, updatable = false)
    private Movie movie;

    public Showtime() {}

    public Showtime(Long movieId, java.sql.Date showDate, java.sql.Time showTime) {
        this.movieId = movieId;
        this.showDate = showDate;
        this.showTime = showTime;
    }

    public Long getShowtimeId() { return showtimeId; }
    public void setShowtimeId(Long showtimeId) { this.showtimeId = showtimeId; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public java.sql.Date getShowDate() { return showDate; }
    public void setShowDate(java.sql.Date showDate) { this.showDate = showDate; }

    public java.sql.Time getShowTime() { return showTime; }
    public void setShowTime(java.sql.Time showTime) { this.showTime = showTime; }

    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }
}