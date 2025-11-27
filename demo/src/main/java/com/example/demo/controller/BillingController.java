package com.example.demo.controller;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.BillingRequest;
import com.example.demo.entity.BillingEntity;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.BillingService;

@RestController
@RequestMapping("/billing")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @Autowired
    private UserRepository userRepository;

    // ✅ Save or update billing info (encrypts card automatically)
   @PutMapping("/submit")
    public ResponseEntity<String> submitBilling(@RequestBody BillingRequest request) {
        try {
            var user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found for ID: " + request.getUserId()));

            // Try to find existing billing — but don’t throw if not found
            BillingEntity billing = billingService.findByUserIdOptional(request.getUserId())
                    .orElse(new BillingEntity());

            billing.setUser(user);
                        billing.setCardType(request.getCardType());
            String incoming = request.getCardNumber();

            if (incoming != null && !incoming.isBlank() && !incoming.startsWith("****")) {
                billing.setCardNumber(incoming); 
            } else {
                System.out.println("Skipping card update — keeping existing encrypted card.");
            }           
             billing.setExpMonth(request.getExpMonth());
            billing.setExpYear(request.getExpYear());
            billing.setStreet(request.getStreet());
            billing.setCity(request.getCity());
            billing.setState(request.getState());
            billing.setZip(request.getZip());

            billingService.saveBilling(billing); // 🔒 this will now always run

            return ResponseEntity.ok("Billing saved successfully (encrypted).");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error saving billing: " + e.getMessage());
        }
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<BillingRequest> getBilling(@PathVariable long userId) {
        try {
            BillingEntity billingEnt = billingService.getBillingForUser(userId); // decrypt + mask handled here

            BillingRequest req = new BillingRequest();
            req.setUserId(userId);
            req.setFirstName(billingEnt.getFirstName());
            req.setLastName(billingEnt.getLastName());
            req.setEmail(billingEnt.getEmail());
            req.setCardType(billingEnt.getCardType());
            req.setCardNumber(billingEnt.getCardNumber()); // already masked
            req.setExpMonth(billingEnt.getExpMonth());
            req.setExpYear(billingEnt.getExpYear());
            req.setStreet(billingEnt.getStreet());
            req.setCity(billingEnt.getCity());
            req.setState(billingEnt.getState());
            req.setZip(billingEnt.getZip());

            return ResponseEntity.ok(req);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
    }
}
