package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "showtimes")
public class ShowtimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "showtime_id")
    private Long showtimeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @Column(name = "show_date", nullable = false)
    private LocalDate showDate;

    @Column(name = "show_time", nullable = false)
    private LocalTime showTime;

    @OneToMany(mappedBy = "showtime", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference  // 👈 pairs with JsonBackReference
    private List<SeatEntity> seats = new ArrayList<>();

    public ShowtimeEntity() {}

    public ShowtimeEntity(Movie movie, LocalDate showDate, LocalTime showTime) {
        this.movie = movie;
        this.showDate = showDate;
        this.showTime = showTime;
    }

    public Long getShowtimeId() { return showtimeId; }
    public void setShowtimeId(Long showtimeId) { this.showtimeId = showtimeId; }

    public Movie getMovie() { return movie; }
    public void setMovie(Movie movie) { this.movie = movie; }

    public LocalDate getShowDate() { return showDate; }
    public void setShowDate(LocalDate showDate) { this.showDate = showDate; }

    public LocalTime getShowTime() { return showTime; }
    public void setShowTime(LocalTime showTime) { this.showTime = showTime; }

    public List<SeatEntity> getSeats() { return seats; }
    public void setSeats(List<SeatEntity> seats) { this.seats = seats; }

    

    // Optional convenience method
    public Long getMovieId() {
        return movie != null ? movie.getMovieId() : null;
    }
}
