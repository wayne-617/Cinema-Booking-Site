package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

 @Entity
 @Table(name = "billing")
public class BillingEntity {
   

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long uid;
    @NotNull
    @Column(nullable = false, unique = true)
    
    private String firstName;
    @NotNull
    @Column(nullable = false)

    private String lastName;
    @NotNull
    @Column(nullable = false)

    private String email;
    @NotNull
    @Column(nullable = false)

    private int last_four;
    @Column(nullable = true)


    public long getUid() {
        return uid;
    }

    public String getFirstName(){
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public int getCardInfo() {
        return last_four;
    }

    public long setUid(long uid) {
        this.uid = uid;
    }

    public String setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String setEmail(String email) {
        this.email = email;
    }

    public int setCardInfo(String last_four){
        this.last_four = last_four;
    }
}
