package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

public class BookingHistoryDTO {

    private Long bookingNo;
    private String movieTitle;
    private Double totalAmount;
    private LocalDateTime purchaseDate;
    private Integer lastFour;
    private Long tixNo;
    private List<String> seats;

    public BookingHistoryDTO(
            Long bookingNo,
            String movieTitle,
            Double totalAmount,
            LocalDateTime purchaseDate,
            Integer lastFour,
            Long tixNo,
            List<String> seats
    ) {
        this.bookingNo = bookingNo;
        this.movieTitle = movieTitle;
        this.totalAmount = totalAmount;
        this.purchaseDate = purchaseDate;
        this.lastFour = lastFour;
        this.tixNo = tixNo;
        this.seats = seats;
    }

    public Long getBookingNo() {
        return bookingNo;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public LocalDateTime getPurchaseDate() {
        return purchaseDate;
    }

    public Integer getLastFour() {
        return lastFour;
    }

    public Long getTixNo() {
        return tixNo;
    }

    public List<String> getSeats() {
        return seats;
    }
}
