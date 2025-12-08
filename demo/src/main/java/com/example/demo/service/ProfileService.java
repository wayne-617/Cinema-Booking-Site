package com.example.demo.service;

import com.example.demo.dto.PaymentMethodDTO;
import com.example.demo.dto.ProfileResponseDTO;
import com.example.demo.dto.ProfileUpdateRequestDTO;
import com.example.demo.entity.BillingEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.BillingRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.EncryptionUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    // ==========================================================
    //                        GET PROFILE
    // ==========================================================
    public ProfileResponseDTO getProfileByUserId(Long userId) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id " + userId));

        List<BillingEntity> billingList = billingRepository.findAllByUser_Id(userId);

        ProfileResponseDTO dto = new ProfileResponseDTO();
        dto.setUserId(user.getId());
        dto.setEmail(user.getUsername());
        dto.setRole(user.getRole().toString());
        dto.setPhone(user.getPhone());
        dto.setPromoOptIn(user.getPromoOptIn());
        dto.setHomeAddress(user.getHomeAddress());

        // Use default billing entry if present
        if (!billingList.isEmpty()) {
            BillingEntity b = billingList.stream()
                    .filter(BillingEntity::isDefault)
                    .findFirst()
                    .orElse(billingList.get(0));

            dto.setFirstName(b.getFirstName());
            dto.setLastName(b.getLastName());
            dto.setBillingEmail(b.getEmail());
            dto.setStreet(b.getStreet());
            dto.setCity(b.getCity());
            dto.setState(b.getState());
            dto.setZip(b.getZip());
        }

        // Build PaymentMethodDTOs
        List<PaymentMethodDTO> paymentDTOs = billingList.stream().map(b -> {
            PaymentMethodDTO pm = new PaymentMethodDTO();
            pm.setId(b.getUid());
            pm.setCardType(b.getCardType());
            pm.setExpMonth(b.getExpMonth());
            pm.setExpYear(b.getExpYear());
            pm.setIsDefault(b.isDefault());

            try {
                String decrypted = EncryptionUtil.decrypt(b.getCardNumber());
                String last4 = decrypted.substring(decrypted.length() - 4);
                pm.setMaskedNumber("**** **** **** " + last4);
            } catch (Exception e) {
                pm.setMaskedNumber("****");
            }

            return pm;
        }).toList();

        dto.setPaymentMethods(paymentDTOs);

        return dto;
    }


    // ==========================================================
    //                    UPDATE PROFILE
    // ==========================================================
    @Transactional
    public void updateProfile(Long userId, ProfileUpdateRequestDTO dto) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ===================== PASSWORD UPDATE =====================
        if (dto.getNewPassword() != null && !dto.getNewPassword().isBlank()) {
            if (dto.getCurrentPassword() == null ||
                    !passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Current password is incorrect");
            }
            user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        }

        // ===================== USER FIELDS =====================
        user.setPhone(dto.getPhone());
        user.setPromoOptIn(dto.getPromoOptIn());
        user.setHomeAddress(dto.getHomeAddress());
        user.setFullName(dto.getFirstName() + " " + dto.getLastName());
        userRepository.save(user);

        // ===================== BILLING UPDATE =====================
        BillingEntity billing = billingRepository.findAllByUser_Id(userId)
                .stream()
                .filter(BillingEntity::isDefault)
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Billing not found"));

        billing.setFirstName(dto.getFirstName());
        billing.setLastName(dto.getLastName());
        billing.setStreet(dto.getStreet());
        billing.setCity(dto.getCity());
        billing.setState(dto.getState());
        billing.setZip(dto.getZip());

        // Card Type
        if (dto.getCardType() != null)
            billing.setCardType(dto.getCardType());

        // ===================== CARD NUMBER UPDATE =====================
        String incomingCard = dto.getCardNumber();

        if (incomingCard != null &&
                !incomingCard.isBlank() &&
                !incomingCard.startsWith("****")) {

            // New card number provided → encrypt and update
            billing.setCardNumber(incomingCard);
        }

        // Expiration
        if (dto.getExpMonth() != null)
            billing.setExpMonth(dto.getExpMonth());

        if (dto.getExpYear() != null)
            billing.setExpYear(dto.getExpYear());

        billingService.saveBilling(billing);
    }
}
