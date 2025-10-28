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

    // Address info
    private String street;
    private String city;
    private String state;
    private String zip;

    // Payment info
    private String cardType;
    private Integer expMonth;
    private Integer expYear;

    private String phone;        // users.phone
    private Boolean promoOptIn;  // users.promo_opt_in

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

     public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Boolean getPromoOptIn() {
        return promoOptIn;
    }
    public void setPromoOptIn(Boolean promoOptIn) {
        this.promoOptIn = promoOptIn;
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

    public String getStreet() {
        return street;
    }
    public void setStreet(String street) {
        this.street = street;
    }
    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }
    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }
    public String getZip() {
        return zip;
    }
    public void setZip(String zip) {
        this.zip = zip;
    }
    public String getCardType() {
        return cardType;
    }
    public void setCardType(String cardType) {
        this.cardType = cardType;
    }
    public Integer getExpMonth() {
        return expMonth;
    }
    public void setExpMonth(Integer expMonth) {
        this.expMonth = expMonth;
    }
    public Integer getExpYear() {
        return expYear;
    }
    public void setExpYear(Integer expYear) {
        this.expYear = expYear;
    }

    

    
}
