package com.example.demo.service;

import com.example.demo.dto.ProfileResponseDTO;
import com.example.demo.dto.ProfileUpdateRequestDTO;
import com.example.demo.entity.BillingEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final BillingService billingService;
    private final PasswordEncoder passwordEncoder;

    public ProfileService(UserRepository userRepository,
                          BillingService billingService,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.billingService = billingService;
        this.passwordEncoder = passwordEncoder;
    }

    public ProfileResponseDTO getProfileByUserId(Long userId) {

        // 1. get user info (users table)
        UserEntity userEntity = userRepository.findById(userId)
            .orElseThrow(() ->
                new RuntimeException("User not found with id " + userId)
            );

        // 2. get billing info (billing table for that user)
        // we wrote BillingService.getBillingForUser(Long userId)
        BillingEntity billingEntity = billingService.getBillingForUser(userId);
        // if no billing row exists yet, billingService currently throws RuntimeException.
        // that's fine for now; it's better than silently returning garbage.

        // 3. build the response DTO
        ProfileResponseDTO dto = new ProfileResponseDTO();
        dto.setUserId(userEntity.getId());
        dto.setEmail(userEntity.getUsername());
        dto.setRole(userEntity.getRole().toString());

        if (billingEntity != null) {
            dto.setFirstName(billingEntity.getFirstName());
            dto.setLastName(billingEntity.getLastName());
            dto.setBillingEmail(billingEntity.getEmail());
            dto.setLastFour(billingEntity.getLastFour()); 
            // NOTE: getCardInfo() returns int last_four in your entity
        }

        return dto;
    }

    public void updateProfile(Long userId, ProfileUpdateRequestDTO updateDto) {

    // 1. Get user
    UserEntity userEntity = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

    // (a) Password change?
    if (updateDto.getNewPassword() != null && !updateDto.getNewPassword().isBlank()) {
        String encoded = passwordEncoder.encode(updateDto.getNewPassword());
        userEntity.setPassword(encoded);
    }

    // (b) promo_opt_in?
    // You haven't added promo_opt_in column yet, so we'll skip for now.
    // When you add `private Integer promoOptIn;` to UserEntity + column, you'll do:
    // userEntity.setPromoOptIn(updateDto.getPromo_opt_in());

    // DO NOT allow changing email here. The requirement said email is not editable.
    // So we don't touch userEntity.setUsername().

    userRepository.save(userEntity);

    // 2. Get billing row
    BillingEntity billingEntity = billingService.getBillingForUser(userId);

    // Update fields we actually have in the billing table right now:
    // billing.firstName, billing.lastName, billing.email, billing.last_four
    ProfileUpdateRequestDTO.BillingUpdateDTO b = updateDto.getBilling();
    if (b != null) {
        if (b.getFirstName() != null) {
            billingEntity.setFirstName(b.getFirstName());
        }
        if (b.getLastName() != null) {
            billingEntity.setLastName(b.getLastName());
        }
        // BillingEntity has billing email too:
        if (b.getPhone() != null) {
            // phone not in table yet; ignore for now
        }
        if (b.getLastFour() != null && !b.getLastFour().isBlank()) {
            try {
                int last4Parsed = Integer.parseInt(b.getLastFour());
                billingEntity.setLastFour(last4Parsed); // your setter for last_four
            } catch (NumberFormatException e) {
                // ignore bad card input instead of killing the request
            }
        }

        // You don't have street/city/state/zip/cardType/expMonth/expYear in BillingEntity yet,
        // so we can't persist them. That's fine for now.
    }

    // save billing changes
    // You'll need a save in BillingService or directly via repo:
    // Option A (quick): expose billingRepository in BillingService with an update method
    billingService.saveBilling(billingEntity);
}

}
