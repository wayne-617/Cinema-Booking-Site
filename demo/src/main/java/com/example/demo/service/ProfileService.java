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
    private final BillingService billingService; // ✅ inject the billing service
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserRepository userRepository,
                          BillingRepository billingRepository,
                          BillingService billingService,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.billingRepository = billingRepository;
        this.billingService = billingService;
        this.passwordEncoder = passwordEncoder;
    }

    public ProfileResponseDTO getProfileByUserId(Long userId) {
        // 1️⃣ Fetch user info
        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        // 2️⃣ Fetch billing info through BillingService (auto decrypts + masks)
        BillingEntity billingEntity = billingService.getBillingForUser(userId);

        // 3️⃣ Build the response DTO
        ProfileResponseDTO dto = new ProfileResponseDTO();

        // --- User info ---
        dto.setUserId(userEntity.getId());
        dto.setEmail(userEntity.getUsername());
        dto.setRole(userEntity.getRole().toString());
        dto.setPhone(userEntity.getPhone());
        dto.setPromoOptIn(userEntity.getPromoOptIn());
        dto.setHomeAddress(userEntity.getHomeAddress());

        // --- Billing info ---
        dto.setFirstName(userEntity.getFullName());
        dto.setLastName(userEntity.getFullName());
        dto.setBillingEmail(billingEntity.getEmail());
        dto.setCardNumber(billingEntity.getCardNumber()); // ✅ already masked (**** **** **** 1234)
        dto.setStreet(billingEntity.getStreet());
        dto.setCity(billingEntity.getCity());
        dto.setState(billingEntity.getState());
        dto.setZip(billingEntity.getZip());
        dto.setCardType(billingEntity.getCardType());
        dto.setExpMonth(billingEntity.getExpMonth());
        dto.setExpYear(billingEntity.getExpYear());

        return dto;
    }

    @Transactional
    public void updateProfile(Long userId, ProfileUpdateRequestDTO dto) {

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        BillingEntity billingEntity = billingRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Billing not found for user id " + userId));

        // --- Update User Entity ---
        if (dto.getNewPassword() != null && !dto.getNewPassword().isBlank()) {
            if (dto.getCurrentPassword() == null ||
                !passwordEncoder.matches(dto.getCurrentPassword(), userEntity.getPassword())) {
                throw new RuntimeException("Current password does not match");
            }
            userEntity.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        }

        userEntity.setPhone(dto.getPhone());
        userEntity.setPromoOptIn(dto.getPromoOptIn());
        userEntity.setFullName(dto.getFirstName() + " " + dto.getLastName());
        userEntity.setHomeAddress(dto.getHomeAddress());
        userRepository.save(userEntity);

        // --- Update Billing Entity ---
       billingEntity.setFirstName(dto.getFirstName());
        billingEntity.setLastName(dto.getLastName());
        billingEntity.setStreet(dto.getStreet());
        billingEntity.setCity(dto.getCity());
        billingEntity.setState(dto.getState());
        billingEntity.setZip(dto.getZip());
        billingEntity.setCardType(dto.getCardType());

        String card = dto.getCardNumber();
        if (card != null && !card.isBlank()) {
            if (!card.startsWith("****")) {
                billingEntity.setCardNumber(card); // real number, will be encrypted
            } else {
                // keep existing encrypted card number (don’t overwrite)
                System.out.println("ℹ️ Skipping encryption — masked card retained.");
            }
        }

        billingEntity.setExpMonth(dto.getExpMonth());
        billingEntity.setExpYear(dto.getExpYear());
        billingService.saveBilling(billingEntity);
    }
}
