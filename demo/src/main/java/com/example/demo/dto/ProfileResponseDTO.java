package com.example.demo.dto;

public class ProfileResponseDTO {

    private Long userId;

    // from users table
    private String email;
    private String role;

    // from billing table
    private String firstName;
    private String lastName;
    private String billingEmail; // billing.email
    private Integer lastFour;    // billing.last_four

    // NOTE:
    // You don't yet have phone, street, city, state, zip, expMonth, expYear, cardType
    // in the DB. We'll leave them out for now to avoid lying to Spring.
    // We can add them later when/if you add columns.

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }

    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getBillingEmail() {
        return billingEmail;
    }
    public void setBillingEmail(String billingEmail) {
        this.billingEmail = billingEmail;
    }

    public Integer getLastFour() {
        return lastFour;
    }
    public void setLastFour(Integer lastFour) {
        this.lastFour = lastFour;
    }
    
}
