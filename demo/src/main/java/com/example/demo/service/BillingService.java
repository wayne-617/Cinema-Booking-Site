package com.example.demo.service;

import com.example.demo.entity.BillingEntity;
import com.example.demo.repository.BillingRepository;
import org.springframework.stereotype.Service;

@Service
public class BillingService {

    private final BillingRepository billingRepository;

    public BillingService(BillingRepository billingRepository) {
        this.billingRepository = billingRepository;
    }

    public BillingEntity getBillingForUser(Long userId) {
        return billingRepository.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException(
                    "Billing not found for user id " + userId
                ));
    }

    public BillingEntity saveBilling(BillingEntity entity) {
        return billingRepository.save(entity);
    }
    

    // later for PUT updates, we'll add something like:
    // public BillingEntity updateBillingForUser(Long userId, BillingUpdateRequest dto) { ... }
}
