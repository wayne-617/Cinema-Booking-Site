package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.BillingEntity;
import com.example.demo.repository.BillingRepository;
import com.example.demo.util.EncryptionUtil;

import jakarta.transaction.Transactional;

@Service
public class BillingService {

    private final BillingRepository billingRepository;

    public BillingService(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

   
    public BillingEntity getById(Long billingId) {
        return billingRepository.findById(billingId)
                .orElseThrow(() -> new RuntimeException("Payment method not found"));
    }

   
    public String maskCard(String encrypted) {
        if (encrypted == null || encrypted.isBlank()) return "****";

        try {
            String decrypted = EncryptionUtil.decrypt(encrypted);

            if (decrypted.length() >= 4) {
                return "**** **** **** " + decrypted.substring(decrypted.length() - 4);
            }

            return "****";

        } catch (Exception e) {
            return "****";
        }
    }

    
    @Transactional
    public void setDefaultCard(Long userId, BillingEntity card) {
        billingRepository.clearDefaultForUser(userId);
        card.setDefault(true);
        billingRepository.save(card);
    }

    @Transactional
    public void clearDefaultsForUser(Long userId) {
        billingRepository.clearDefaultForUser(userId);
    }

   
    public BillingEntity saveBilling(BillingEntity entity) {
        String incomingCard = entity.getCardNumber();

        if (incomingCard == null || incomingCard.isBlank()) {
              return billingRepository.save(entity);
        }

        // If already encrypted, save as-is
        if (looksEncrypted(incomingCard)) {
            return billingRepository.save(entity);
        }

        // Encrypt first
        try {
            String encrypted = EncryptionUtil.encrypt(incomingCard);
            entity.setCardNumber(encrypted);
        } catch (Exception e) {
            throw new RuntimeException("Failed to encrypt card: " + e.getMessage(), e);
        }

        return billingRepository.save(entity);
    }

    
    private boolean looksEncrypted(String incoming) {
        return incoming.matches("^[A-Za-z0-9+/=]+$") && incoming.length() > 20;
    }

   
    public List<BillingEntity> findAllForUser(Long userId) {
        return billingRepository.findAllByUser_Id(userId);
    }

   
    public void deletePaymentMethod(Long billingUid, Long userId) {

        BillingEntity billing = billingRepository.findById(billingUid)
                .orElseThrow(() -> new RuntimeException("Payment method not found."));

        if (!billing.getUser().getId().equals(userId)) {
            throw new RuntimeException("You cannot delete another user's payment method.");
        }

        billingRepository.deleteById(billingUid);
    }
}
