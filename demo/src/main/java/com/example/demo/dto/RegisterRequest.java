package com.example.demo.dto;

public class RegisterRequest {

    // --- Basic user info ---
    private String username;      // user’s email
    private String password;
    private String fullName;
    private String phone;
    private Boolean promoOptIn = false;
    private String homeAddress;   // user’s main home address

    // --- Billing address ---
    private String street;
    private String city;
    private String state;
    private String zip;

    // --- Payment info ---
    private String cardType;
    private String cardNumber;   // full card number (will be encrypted later)
    private Integer expMonth;
    private Integer expYear;

    // --- Getters & Setters ---
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public String getFullName() {
        return fullName;
    }
    public void setFullName(String fullName) {
        this.fullName = fullName;
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

    public String getHomeAddress() {
        return homeAddress;
    }
    public void setHomeAddress(String homeAddress) {
        this.homeAddress = homeAddress;
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

    public String getCardNumber() {
        return cardNumber;
    }
    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
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
