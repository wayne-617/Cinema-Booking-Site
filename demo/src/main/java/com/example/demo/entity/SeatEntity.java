package com.example.demo.entity;

import jakarta.persistence.*;
import com.example.demo.entity.ShowtimeEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.example.demo.entity.BookingEntity;

@Entity
@Table(name = "seats")
public class SeatEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Long seatId;


    @Column(name = "seat_row", nullable = false)
    private String seatRow;    // e.g. "A"

    @Column(name = "seat_number", nullable = false)
    private Integer seatNumber;  // e.g. 10

    @Column(name = "is_booked", nullable = false)
    private Boolean isBooked = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "showtime_id", nullable = false)
    @JsonBackReference  // 👈 prevents looping
    private ShowtimeEntity showtime;

   @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    @JsonIgnore
    private BookingEntity booking;

    // --- Getters & Setters ---
    public Long getSeatId() { return seatId; }
    public void setSeatId(Long seatId) { this.seatId = seatId; }

    public String getSeatRow() { return seatRow; }
    public void setSeatRow(String seatRow) { this.seatRow = seatRow; }

    public Integer getSeatNumber() { return seatNumber; }
    public void setSeatNumber(Integer seatNumber) { this.seatNumber = seatNumber; }

    public Boolean getIsBooked() { return isBooked; }
    public void setIsBooked(Boolean isBooked) { this.isBooked = isBooked; }

    public ShowtimeEntity getShowtime() { return showtime; }
    public void setShowtime(ShowtimeEntity showtime) { this.showtime = showtime; }
    public BookingEntity getBooking() { return booking; }
    public void setBooking(BookingEntity booking) { this.booking = booking; }

    @Override
    public String toString() {
        return seatRow + seatNumber + (isBooked ? " [BOOKED]" : " [AVAILABLE]");
    }
}