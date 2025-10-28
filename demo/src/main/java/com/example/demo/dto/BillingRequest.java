package com.example.demo.dto;

public class BillingRequest {
    private int exp_month;
    private int exp_year;
    private int last_four;
    private long uid;
    private String cardType;
    private String city;
    private String email;
    private String state;
    private String street;
    private String zip;

    public int getExpMonth() {
        return exp_month;
    }

    public void setExpMonth(int exp_month) {
        this.exp_month = exp_month;
    }

     public int getExpYear() {
        return exp_year;
    }

    public void setExpYear(int exp_year) {
        this.exp_year = exp_year;
    }

     public int getLastFour() {
        return last_four;
    }

    public void setLastFour(int last_four) {
        this.last_four = last_four;
    }

     public long getUid() {
        return uid;
    }

    public void setUid(long uid) {
        this.uid = uid;
    }

     public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

     public  String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

     public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getStreet() {
        return state;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getZip() {
        return zip;
    }

    public void setZip( String zip) {
        this.zip = zip;
    }

    public String getCity() {
        return city;
    }

    public void setCity( String city) {
        this.city = city;
    }

}

