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
    private final BillingService billingService;
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

    // GET PROFILE
    public ProfileResponseDTO getProfileByUserId(Long userId) {

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        BillingEntity billingEntity = billingService.getBillingForUser(userId);

        ProfileResponseDTO dto = new ProfileResponseDTO();

        // User fields
        dto.setUserId(userEntity.getId());
        dto.setEmail(userEntity.getUsername());
        dto.setRole(userEntity.getRole().toString());
        dto.setPhone(userEntity.getPhone());
        dto.setPromoOptIn(userEntity.getPromoOptIn());
        dto.setHomeAddress(userEntity.getHomeAddress());

        dto.setFirstName(billingEntity.getFirstName());
        dto.setLastName(billingEntity.getLastName());
        dto.setBillingEmail(billingEntity.getEmail());

        dto.setCardNumber(billingEntity.getCardNumber());
        dto.setCardType(billingEntity.getCardType());
        dto.setExpMonth(billingEntity.getExpMonth());
        dto.setExpYear(billingEntity.getExpYear());

        dto.setStreet(billingEntity.getStreet());
        dto.setCity(billingEntity.getCity());
        dto.setState(billingEntity.getState());
        dto.setZip(billingEntity.getZip());

        return dto;
    }

    // UPDATE PROFILE
    @Transactional
    public void updateProfile(Long userId, ProfileUpdateRequestDTO dto) {

        UserEntity userEntity = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        BillingEntity billingEntity = billingRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("Billing not found for user id " + userId));

        // Update User fields
        if (dto.getNewPassword() != null && !dto.getNewPassword().isBlank()) {
            if (dto.getCurrentPassword() == null ||
                !passwordEncoder.matches(dto.getCurrentPassword(), userEntity.getPassword())) {
                throw new RuntimeException("Current password does not match");
            }
            userEntity.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        }


        userEntity.setFullName(dto.getFirstName() + " " + dto.getLastName());
        userEntity.setPhone(dto.getPhone());
        userEntity.setPromoOptIn(dto.getPromoOptIn());
        userEntity.setHomeAddress(dto.getHomeAddress());
        userRepository.save(userEntity);

        billingEntity.setFirstName(dto.getFirstName());
        billingEntity.setLastName(dto.getLastName());
        billingEntity.setStreet(dto.getStreet());
        billingEntity.setCity(dto.getCity());
        billingEntity.setState(dto.getState());
        billingEntity.setZip(dto.getZip());
        billingEntity.setCardType(dto.getCardType());

        String incomingCard = dto.getCardNumber();

        if (incomingCard != null && !incomingCard.startsWith("****") && !incomingCard.isBlank()) {
            billingEntity.setCardNumber(incomingCard);
        } else {
            System.out.println("No new card — keeping existing encrypted card.");
        }

        billingEntity.setExpMonth(dto.getExpMonth());
        billingEntity.setExpYear(dto.getExpYear());

        billingService.saveBilling(billingEntity);
    }
}
