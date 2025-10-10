package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

 @Entity
 @Table(name = "booking")
public class BookingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long booking_no;
    @NotNull
    @Column(nullable = false, unique = true)
    
    private long tix_no;
    @NotNull
    @Column(nullable = false, unique = true)

    private String movie_title;
    @NotNull
    @Column(nullable = false, unique = true)

    private long showDate_Time;
    @NotNull
    @Column(nullable = false, unique = true)

    private int last_four;
    @NotNull
    @Column(nullable = false, unique = true)



    
    public int getCardInfo() {
        return last_four;
    }
}
