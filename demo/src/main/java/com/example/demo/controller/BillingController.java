package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.BillingRequest;
import com.example.demo.dto.PaymentMethodDTO;
import com.example.demo.entity.BillingEntity;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.BillingService;
import com.example.demo.util.EncryptionUtil;
@RestController
@RequestMapping("/billing")
public class BillingController {

    @Autowired
    private BillingService billingService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    // ============================
    //   SAVE or UPDATE BILLING
    // ============================
    @PutMapping("/submit")
    public ResponseEntity<String> submitBilling(@RequestBody BillingRequest request) {
        try {
            var user = userRepository.findById(request.getUserId())
                    .orElseThrow(() ->
                            new RuntimeException("User not found for ID: " + request.getUserId())
                    );

            // Get existing or create new
            BillingEntity billing = billingService.findAllForUser(request.getUserId())
                    .stream()
                    .findFirst()
                    .orElse(new BillingEntity());

            billing.setUser(user);

            // Always update card type
            billing.setCardType(request.getCardType());

            // Handle card number safely
            String incoming = request.getCardNumber();
            if (incoming != null && !incoming.isBlank() && !incoming.startsWith("****")) {
                billing.setCardNumber(incoming);
            }

            // Expiration
            billing.setExpMonth(request.getExpMonth());
            billing.setExpYear(request.getExpYear());

            // Address
            billing.setStreet(request.getStreet());
            billing.setCity(request.getCity());
            billing.setState(request.getState());
            billing.setZip(request.getZip());

            // Save email (billing table stores its own copy)
            billing.setEmail(request.getEmail());

            // Extract name from user record if needed
            if (user.getFullName() != null) {
                String[] parts = user.getFullName().trim().split(" ");
                if (parts.length > 0) billing.setFirstName(parts[0]);
                if (parts.length > 1) billing.setLastName(parts[1]);
            }

            billingService.saveBilling(billing);

            // Send notification
            try {
                SimpleMailMessage msg = new SimpleMailMessage();
                msg.setTo(user.getUsername());
                msg.setSubject("Your billing info was updated");
                msg.setText("This is a confirmation that your billing details were updated.");
                mailSender.send(msg);
            } catch (Exception ignored) {}

            return ResponseEntity.ok("Billing saved successfully.");

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error saving billing: " + e.getMessage());
        }
    }

    // ============================
    //     GET BILLING FOR USER
    // ============================
    @GetMapping("/get/{userId}")
    public ResponseEntity<BillingRequest> getBilling(@PathVariable long userId) {
        try {
            BillingEntity billingEnt = billingService.findAllForUser(userId)
                    .stream()
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No billing info found for user ID: " + userId));

            BillingRequest req = new BillingRequest();
            req.setUserId(userId);
            req.setFirstName(billingEnt.getFirstName());
            req.setLastName(billingEnt.getLastName());
            req.setEmail(billingEnt.getEmail());
            req.setCardType(billingEnt.getCardType());
            req.setCardNumber(billingEnt.getCardNumber());
            req.setExpMonth(billingEnt.getExpMonth());
            req.setExpYear(billingEnt.getExpYear());
            req.setStreet(billingEnt.getStreet());
            req.setCity(billingEnt.getCity());
            req.setState(billingEnt.getState());
            req.setZip(billingEnt.getZip());

            return ResponseEntity.ok(req);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @GetMapping("/all/{userId}")
    public ResponseEntity<List<PaymentMethodDTO>> getAllPaymentMethods(@PathVariable long userId) {
        var list = billingService.findAllForUser(userId);

        List<PaymentMethodDTO> dtoList = list.stream().map(b -> {
            PaymentMethodDTO dto = new PaymentMethodDTO();
            dto.setId(b.getUid());
            dto.setCardType(b.getCardType());
            dto.setExpMonth(b.getExpMonth());
            dto.setExpYear(b.getExpYear());
            dto.setMaskedNumber(billingService.maskCard(b.getCardNumber()));
            dto.setIsDefault(b.isDefault()); 
            return dto;
        }).toList();

        return ResponseEntity.ok(dtoList);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addPaymentMethod(@RequestBody BillingRequest req) {
        try {
            var user = userRepository.findById(req.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            BillingEntity billing = new BillingEntity();
            billing.setUser(user);

            billing.setCardType(req.getCardType());
            billing.setCardNumber(req.getCardNumber()); // encrypted in service
            billing.setExpMonth(req.getExpMonth());
            billing.setExpYear(req.getExpYear());
            billing.setStreet(req.getStreet());
            billing.setCity(req.getCity());
            billing.setState(req.getState());
            billing.setZip(req.getZip());
            billing.setEmail(req.getEmail());

            // optional: derive name
            if (user.getFullName() != null) {
                String[] parts = user.getFullName().trim().split(" ");
                if (parts.length > 0) billing.setFirstName(parts[0]);
                if (parts.length > 1) billing.setLastName(parts[1]);
            }

            if (billingService.findAllForUser(req.getUserId()).size() >= 3) {
                return ResponseEntity.status(400).body("Maximum of 3 cards allowed.");
            }

            billingService.saveBilling(billing);

            return ResponseEntity.ok("Payment method added.");

        } catch (Exception e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }
    @DeleteMapping("/{billingId}/{userId}")
    public ResponseEntity<String> deleteMethod(
            @PathVariable long billingId,
            @PathVariable long userId) {

        System.out.println("DELETE REQUEST RECEIVED for BillingID=" 
                           + billingId + " by user " + userId);

        try {
            billingService.deletePaymentMethod(billingId, userId);
            System.out.println(" Deleted!");
            return ResponseEntity.ok("Payment method deleted.");
        } catch (Exception e) {
            System.out.println("DELETE FAILED: " + e.getMessage());
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }
    

    @PutMapping("/update/{billingId}")
    public ResponseEntity<String> updatePaymentMethod(
            @PathVariable long billingId,
            @RequestBody BillingRequest req
    ) {
        try {
            var user = userRepository.findById(req.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            BillingEntity billing = billingService.getById(billingId);

            // Ownership check
            if (!billing.getUser().getId().equals(req.getUserId())) {
                return ResponseEntity.status(403).body("Cannot edit another user's card.");
            }

            // Update fields
            billing.setCardType(req.getCardType());

            // Only replace card # if new unmasked value provided
            if (req.getCardNumber() != null &&
                !req.getCardNumber().isBlank() &&
                !req.getCardNumber().startsWith("****")) {

                billing.setCardNumber(EncryptionUtil.encrypt(req.getCardNumber()));
            }

            billing.setExpMonth(req.getExpMonth());
            billing.setExpYear(req.getExpYear());

            // Handle default card
            if (req.isDefault()) {
                billingService.clearDefaultsForUser(req.getUserId());
                billing.setDefault(true);
            } else {
                billing.setDefault(false);
            }

            billingService.saveBilling(billing);

            return ResponseEntity.ok("Payment method updated.");

        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error updating payment method: " + e.getMessage());
        }
    }

}
