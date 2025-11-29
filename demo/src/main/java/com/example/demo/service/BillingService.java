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

    String incoming = entity.getCardNumber();

    // Get existing DB record so we preserve old card number
    BillingEntity existing = billingRepository.findByUser_Id(entity.getUser().getId())
            .orElse(null);

    // CASE 1 — user did NOT edit card number at all
    if (incoming == null || incoming.isBlank()) {
        System.out.println("⚠️ No new card — keeping existing encrypted card.");
        if (existing != null) {
            entity.setCardNumber(existing.getCardNumber());
        }
        return billingRepository.save(entity);
    }

    // CASE 2 — incoming value is already encrypted → don't re-encrypt
    if (looksEncrypted(incoming)) {
        System.out.println("⚠️ Incoming card looks encrypted — preserving without re-encryption.");
        return billingRepository.save(entity);
    }

    // CASE 3 — new plaintext card number provided → encrypt it
    try {
        System.out.println("💾 Encrypting new plaintext card: " + incoming);
        String encrypted = EncryptionUtil.encrypt(incoming);
        entity.setCardNumber(encrypted);
    } catch (Exception e) {
        throw new RuntimeException("Failed to encrypt card: " + e.getMessage(), e);
    }

    return billingRepository.save(entity);
}

    
    private boolean looksEncrypted(String incoming) {
        return incoming.matches("^[A-Za-z0-9+/=]+$") && incoming.length() > 20;
    }

    public Optional<BillingEntity> findByUserIdOptional(Long userId) {
        return billingRepository.findByUser_Id(userId);
    }

    // later for PUT updates, we'll add something like:
    // public BillingEntity updateBillingForUser(Long userId, BillingUpdateRequest dto) { ... }
}
