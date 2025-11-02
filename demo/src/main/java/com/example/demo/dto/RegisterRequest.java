package com.example.demo.dto;

public class RegisterRequest {
    private String username;
    private String password;
    private String fullName;
    private String phone;
    private Boolean promoOptIn = false;

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getFullName() {
        return fullName;
    }
    
    public String getPhone() {
        return phone;
    }

    public Boolean getPromoOptIn() {
        return promoOptIn;
    }

}
