package com.example.demo.service;

import com.example.demo.dto.ProfileResponseDTO;
import com.example.demo.dto.ProfileUpdateRequestDTO;
import com.example.demo.entity.BillingEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.BillingRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final BillingRepository billingRepository;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserRepository userRepository,
                          BillingRepository billingRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.billingRepository = billingRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public ProfileResponseDTO getProfileByUserId(Long userId) {

        // 1. Get user info
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        // 2. Get billing info
        BillingEntity billingEntity = billingRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Billing not found for user id " + userId));

        // 3. Build the response DTO
        ProfileResponseDTO dto = new ProfileResponseDTO();

        // --- Set User fields ---
        dto.setUserId(userEntity.getId());
        dto.setEmail(userEntity.getUsername());
        dto.setRole(userEntity.getRole().toString());
        dto.setPhone(userEntity.getPhone());
        dto.setPromoOptIn(userEntity.getPromoOptIn());

        // --- Set Billing fields ---
        dto.setFirstName(billingEntity.getFirstName());
        dto.setLastName(billingEntity.getLastName());
        dto.setBillingEmail(billingEntity.getEmail()); // Billing email, not user email
        dto.setLastFour(billingEntity.getLastFour());

        // --- SET NEW ADDRESS & PAYMENT FIELDS ---
        dto.setStreet(billingEntity.getStreet());
        dto.setCity(billingEntity.getCity());
        dto.setState(billingEntity.getState());
        dto.setZip(billingEntity.getZip());
        dto.setCardType(billingEntity.getCardType());
        dto.setExpMonth(billingEntity.getExpMonth());
        dto.setExpYear(billingEntity.getExpYear());

        return dto;
    }

    @Transactional // Add this so both saves happen in one transaction
    public void updateProfile(Long userId, ProfileUpdateRequestDTO dto) {

        // 1. Get user
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        // 2. Get billing row
        BillingEntity billingEntity = billingRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Billing not found for user id " + userId));

        // --- (A) Update User Entity ---

        // Handle Password change
        if (dto.getNewPassword() != null && !dto.getNewPassword().isBlank()) {
            if (dto.getCurrentPassword() == null || !passwordEncoder.matches(dto.getCurrentPassword(), userEntity.getPassword())) {
                throw new RuntimeException("Current password does not match");
            }
            userEntity.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        }

        // Update other user fields
        userEntity.setPhone(dto.getPhone());
        userEntity.setPromoOptIn(dto.getPromoOptIn());
        // Also update fullName to stay in sync
        userEntity.setFullName(dto.getFirstName() + " " + dto.getLastName());

        userRepository.save(userEntity);

        // --- (B) Update Billing Entity ---
        billingEntity.setFirstName(dto.getFirstName());
        billingEntity.setLastName(dto.getLastName());
        
        // Update new address fields
        billingEntity.setStreet(dto.getStreet());
        billingEntity.setCity(dto.getCity());
        billingEntity.setState(dto.getState());
        billingEntity.setZip(dto.getZip());

        // Update new payment fields
        billingEntity.setCardType(dto.getCardType());
        billingEntity.setLastFour(dto.getLastFour());
        billingEntity.setExpMonth(dto.getExpMonth());
        billingEntity.setExpYear(dto.getExpYear());

        billingRepository.save(billingEntity);
    }
}

