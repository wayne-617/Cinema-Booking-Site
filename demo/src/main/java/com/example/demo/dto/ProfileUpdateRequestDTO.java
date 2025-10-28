package com.example.demo.dto;

// This DTO maps to the JSON payload sent by the React 'handleSave' function
// This is the file your ProfileController is importing and using.
public class ProfileUpdateRequestDTO {

    // From User
    private String phone;
    private Boolean promoOptIn;

    // From Billing
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


    // Password
    private String currentPassword;
    private String newPassword;

    // --- Getters and Setters for all fields ---

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

    public String getCurrentPassword() {
        return currentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        this.currentPassword = currentPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
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

