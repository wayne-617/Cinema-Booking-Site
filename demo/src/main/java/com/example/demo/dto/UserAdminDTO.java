package com.example.demo.dto;

public record UserAdminDTO(
        Long id,
        String username,
        String fullName,
        String phone,
        String role,
        Boolean enabled,
        Boolean promoOptIn,
        String homeAddress
) {}
