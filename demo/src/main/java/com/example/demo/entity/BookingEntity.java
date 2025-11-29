package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "booking")
public class BookingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "billing_id", nullable = false)
    @JsonIgnore
    private BillingEntity billing;

    private String movieTitle;
    private LocalDateTime showDateTime;
    private Long tixNo;
    private Integer lastFour;
    private Double totalAmount;
    private LocalDateTime purchaseDate = LocalDateTime.now();

    @JsonIgnore
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SeatEntity> seats = new ArrayList<>();

    public BookingEntity() {}

    // --- Getters & Setters ---
    public Long getBookingNo() { return bookingNo; }
    public void setBookingNo(Long bookingNo) { this.bookingNo = bookingNo; }

    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }

    public BillingEntity getBilling() { return billing; }
    public void setBilling(BillingEntity billing) { this.billing = billing; }

    public String getMovieTitle() { return movieTitle; }
    public void setMovieTitle(String movieTitle) { this.movieTitle = movieTitle; }

    public LocalDateTime getShowDateTime() { return showDateTime; }
    public void setShowDateTime(LocalDateTime showDateTime) { this.showDateTime = showDateTime; }

    public Long getTixNo() { return tixNo; }
    public void setTixNo(Long tixNo) { this.tixNo = tixNo; }

    public Integer getLastFour() { return lastFour; }
    public void setLastFour(Integer lastFour) { this.lastFour = lastFour; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public LocalDateTime getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(LocalDateTime purchaseDate) { this.purchaseDate = purchaseDate; }

    public List<SeatEntity> getSeats() { return seats; }
    public void setSeats(List<SeatEntity> seats) { this.seats = seats; }

  
}
