package com.example.demo.dto;

public class AuthUserDTO {

    private Long id;              // users.id (PK)
    private String username;      // users.username (this is the email)
    private String password;
    private String role;          // "ADMIN" or "CUSTOMER"
    private Integer passwordLength; // we'll give length only, not the actual password
    private String name;
    private String phone;

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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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
