package com.example.demo.util;

import com.example.demo.entity.BillingEntity;
import com.example.demo.repository.BillingRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import java.util.List;

@Component
public class CardEncryptionFix implements ApplicationRunner {

    private final BillingRepository billingRepository;

    public CardEncryptionFix(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        System.out.println("Running one-time card encryption fix (after startup)...");
        List<BillingEntity> all = billingRepository.findAll();
        int fixedCount = 0;

        for (BillingEntity b : all) {
            String card = b.getCardNumber();
            if (card != null && !card.isBlank()) {
                String raw = card.trim().replaceAll("[\\s-]", "");
                if (raw.matches("\\d{13,19}")) {
                    try {
                        String encrypted = EncryptionUtil.encrypt(raw);
                        b.setCardNumber(encrypted);
                        billingRepository.save(b);
                        fixedCount++;
                        System.out.println("Encrypted plaintext card for user " + b.getUser().getId());
                    } catch (Exception e) {
                        System.err.println("Failed to encrypt card for user " + b.getUser().getId() + ": " + e.getMessage());
                    }
                }
            }
        }

        System.out.println("Fixed " + fixedCount + " unencrypted cards.");
    }
}
