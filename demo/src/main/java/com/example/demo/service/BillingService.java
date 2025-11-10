package com.example.demo.service;

import com.example.demo.entity.BillingEntity;
import com.example.demo.repository.BillingRepository;
import com.example.demo.util.EncryptionUtil;

import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class BillingService {

    private final BillingRepository billingRepository;

    public BillingService(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    public BillingEntity getBillingForUser(Long userId) {
    BillingEntity billing = billingRepository.findByUser_Id(userId)
            .orElseThrow(() -> new RuntimeException(
                    "Billing not found for user id " + userId
            ));

    if (billing.getCardNumber() != null && !billing.getCardNumber().isEmpty()) {
        try {
            String decryptedCard = EncryptionUtil.decrypt(billing.getCardNumber());

            // Mask all but last 4 digits before sending to frontend
            if (decryptedCard.length() > 4) {
                String last4 = decryptedCard.substring(decryptedCard.length() - 4);
                billing.setCardNumber("**** **** **** " + last4);
            } else {
                billing.setCardNumber("****");
            }
        } catch (Exception e) {
            System.err.println("⚠️ Failed to decrypt card for user " + userId + ": " + e.getMessage());
            billing.setCardNumber("****");
        }
    }

    return billing;
}
   


    public BillingEntity saveBilling(BillingEntity entity) {
    if (entity.getCardNumber() != null && !entity.getCardNumber().isEmpty()) {
        try {
            System.out.println("💾 Encrypting before save: " + entity.getCardNumber());
            String encryptedCard = EncryptionUtil.encrypt(entity.getCardNumber());
            System.out.println("🔒 Encrypted value: " + encryptedCard);
            entity.setCardNumber(encryptedCard);
            
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to encrypt card number: " + e.getMessage(), e);
        }
    } else {
        System.out.println("⚠️ No card number provided — skipping encryption.");
    }

    return billingRepository.save(entity);
}

    
    public Optional<BillingEntity> findByUserIdOptional(Long userId) {
        return billingRepository.findByUser_Id(userId);
    }

    // later for PUT updates, we'll add something like:
    // public BillingEntity updateBillingForUser(Long userId, BillingUpdateRequest dto) { ... }
}
