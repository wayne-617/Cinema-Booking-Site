package com.example.demo.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class SystemSettings {
    @Id
    private Long id = 1L;

    private double onlineFee;

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public double getOnlineFee() {
        return onlineFee;
    }
    public void setOnlineFee(double onlineFee) {
        this.onlineFee = onlineFee;
    }
}
