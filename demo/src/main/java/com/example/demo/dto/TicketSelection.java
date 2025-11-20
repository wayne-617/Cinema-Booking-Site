package com.example.demo.dto;

public class TicketSelection {
    private Long seatId;
    private String type; // "ADULT", "CHILD", "SENIOR"
    // Getters and setters
    public Long getSeatId() {
        return seatId;
    }
    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
}
