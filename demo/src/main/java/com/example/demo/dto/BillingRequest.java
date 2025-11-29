package com.example.demo.dto;

public class BillingRequest {
    private Long userId;
    private String cardType;
    private String cardNumber;
    private Integer expMonth;
    private Integer expYear;
    private String street;
    private String city;
    private String state;
    private String zip;
    private String firstName;
    private String lastName;
    private String email;
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getCardType() { return cardType; }
    public void setCardType(String cardType) { this.cardType = cardType; }

    public String getCardNumber() { return cardNumber; }
    public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }

    public Integer getExpMonth() { return expMonth; }
    public void setExpMonth(Integer expMonth) { this.expMonth = expMonth; }

    public Integer getExpYear() { return expYear; }
    public void setExpYear(Integer expYear) { this.expYear = expYear; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZip() { return zip; }
    public void setZip(String zip) { this.zip = zip; }
}
