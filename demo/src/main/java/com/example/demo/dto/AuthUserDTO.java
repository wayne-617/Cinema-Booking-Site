package com.example.demo.dto;

public class AuthUserDTO {

    private Long id;              // users.id (PK)
    private String username;      // users.username (this is the email)
    private String role;          // "ADMIN" or "CUSTOMER"
    private Integer passwordLength; // we'll give length only, not the actual password

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }

    public Integer getPasswordLength() {
        return passwordLength;
    }
    public void setPasswordLength(Integer passwordLength) {
        this.passwordLength = passwordLength;
    }
}
