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

    // Add a foreign key reference to the UserEntity
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // This will be the foreign key column
    private UserEntity user;  // Reference to the UserEntity

    public long getUid() {
        return uid;
    }

    public String getFirstName() {
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

    public UserEntity getUser() {
        return user;
    }

    public void setUid(long uid) {
        this.uid = uid;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setCardInfo(int last_four) {
        this.last_four = last_four;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }
}
