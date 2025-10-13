package com.example.demo.dto;

public class ShowtimeRequest {
    private Long showtimeId;
    private Long movieId;
    private String title;
    private String posterUrl;
    private String showDate;
    private String showTime;

    public ShowtimeRequest(Long showtimeId, Long movieId, String title, String posterUrl, String showDate, String showTime) {
        this.showtimeId = showtimeId;
        this.movieId = movieId;
        this.title = title;
        this.posterUrl = posterUrl;
        this.showDate = showDate;
        this.showTime = showTime;
    }

    public Long getShowtimeId() { return showtimeId; }
    public Long getMovieId() { return movieId; }
    public String getTitle() { return title; }
    public String getPosterUrl() { return posterUrl; }
    public String getShowDate() { return showDate; }
    public String getShowTime() { return showTime; }
}
