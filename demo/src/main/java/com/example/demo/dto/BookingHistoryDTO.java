package com.example.demo.dto;

import java.time.LocalDateTime;
import java.util.List;

public class BookingHistoryDTO {

    private Long bookingNo;
    private String movieTitle;
    private Double totalAmount;
    private LocalDateTime purchaseDate;
    private Integer lastFour;
    private Long ticketCount;         
    private List<String> seats;
    private String customerName;


    public BookingHistoryDTO(
            Long bookingNo,
            String movieTitle,
            Double totalAmount,
            LocalDateTime purchaseDate,
            Integer lastFour,
            Long ticketCount,
            List<String> seats,
            String customerName
    ) {
        this.bookingNo = bookingNo;
        this.movieTitle = movieTitle;
        this.totalAmount = totalAmount;
        this.purchaseDate = purchaseDate;
        this.lastFour = lastFour;
        this.ticketCount = ticketCount;
        this.seats = seats;
        this.customerName = customerName;
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

    public Long getTicketCount() {
        return ticketCount;
    }

    public List<String> getSeats() {
        return seats;
    }
    public String getCustomerName() {
        return customerName;
    }

}
