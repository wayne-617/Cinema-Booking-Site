package com.example.demo.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AuthUserDTO;
import com.example.demo.dto.BillingRequest;
import com.example.demo.repository.BillingRepository;
import com.example.demo.repository.UserRepository;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.example.demo.entity.BillingEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.service.BillingService;
@RestController
@RequestMapping("/billing")
public class BillingController {
    
     @Autowired
    BillingRepository billingRepository;
    @Autowired
    BillingService billingService;
    @Autowired
    UserRepository userRepository;
    
    @PutMapping("/submit")
    public ResponseEntity<String> submitBilling(@RequestBody BillingRequest request) {
        try {
            // Find user by ID first
            var user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found for ID: " + request.getUserId()));

            // Find existing billing record or create new
            Optional<BillingEntity> billingOpt = billingRepository.findByUser_Id(request.getUserId());
            BillingEntity billing = billingOpt.orElseGet(BillingEntity::new);

            billing.setUser(user);
            billing.setCardType(request.getCardType());
            billing.setCardNumber(request.getCardNumber());
            billing.setExpMonth(request.getExpMonth());
            billing.setExpYear(request.getExpYear());
            billing.setStreet(request.getStreet());
            billing.setCity(request.getCity());
            billing.setState(request.getState());
            billing.setZip(request.getZip());

            billingRepository.save(billing);
            return ResponseEntity.ok("Billing saved successfully");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error saving billing: " + e.getMessage());
        }
    }

    // ✅ Get billing by user ID
    @GetMapping("/get/{userId}")
    public ResponseEntity<BillingRequest> getBilling(@PathVariable long userId) {
        BillingEntity billingEnt = billingRepository.findByUser_Id(userId)
            .orElseThrow(() -> new RuntimeException("Billing not found for userId: " + userId));

        BillingRequest req = new BillingRequest();
        req.setUserId(userId);
        req.setCardType(billingEnt.getCardType());
        req.setCardNumber(billingEnt.getCardNumber());
        req.setExpMonth(billingEnt.getExpMonth());
        req.setExpYear(billingEnt.getExpYear());
        req.setStreet(billingEnt.getStreet());
        req.setCity(billingEnt.getCity());
        req.setState(billingEnt.getState());
        req.setZip(billingEnt.getZip());

        return ResponseEntity.ok(req);
    }

}
