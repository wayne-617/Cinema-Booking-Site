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
    private Double onlineFee;
    private LocalDateTime showDateTime;
    private String tixNo;


    public BookingHistoryDTO(
            Long bookingNo,
            String movieTitle,
            Double totalAmount,
            LocalDateTime purchaseDate,
            Double onlineFee,
            LocalDateTime showDateTime,
            Integer lastFour,
            Long ticketCount,
            List<String> seats,
            String customerName,
            String tixNo
    ) {
        this.bookingNo = bookingNo;
        this.movieTitle = movieTitle;
        this.totalAmount = totalAmount;
        this.purchaseDate = purchaseDate;
        this.lastFour = lastFour;
        this.ticketCount = ticketCount;
        this.seats = seats;
        this.customerName = customerName;
        this.onlineFee = onlineFee;
        this.showDateTime = showDateTime;
        this.tixNo = tixNo;
    }

    public Long getBookingNo() {
        return bookingNo;
    }

    public String getTixNo() {
        return tixNo;
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
    public Double getOnlineFee() {
        return onlineFee;
    }
    public LocalDateTime getShowDateTime() {
        return showDateTime;
    }

} 
