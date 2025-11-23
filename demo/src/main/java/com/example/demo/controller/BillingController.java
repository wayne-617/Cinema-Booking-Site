package com.example.demo.controller;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailException;
import com.example.demo.dto.BillingRequest;
import com.example.demo.entity.BillingEntity;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.BillingService;

@RestController
@RequestMapping("/billing")
public class BillingController {

    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private BillingService billingService;

    @Autowired
    private UserRepository userRepository;

    //Save or update billing info 
   @PutMapping("/submit")
    public ResponseEntity<String> submitBilling(@RequestBody BillingRequest request) {
        try {
            var user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found for ID: " + request.getUserId()));

         
            BillingEntity billing = billingService.findByUserIdOptional(request.getUserId())
                    .orElse(new BillingEntity());

            billing.setUser(user);
            billing.setCardType(request.getCardType());
            billing.setCardNumber(request.getCardNumber()); // encryption handled by service
            billing.setExpMonth(request.getExpMonth());
            billing.setExpYear(request.getExpYear());
            billing.setStreet(request.getStreet());
            billing.setCity(request.getCity());
            billing.setState(request.getState());
            billing.setZip(request.getZip());
            billing.setFirstName(user.getFullName().split(" ")[0]);
            billing.setLastName(user.getFullName().split(" ")[1]);
            billingService.saveBilling(billing); 

            if (user != null) {

                 try {
                     SimpleMailMessage message = new SimpleMailMessage();
                    message.setTo(user.getUsername());
                    message.setSubject("Profile info changed");
                    message.setText("Your profile info under Edit Profile has been changed.");
                    mailSender.send(message);
                } catch (Exception e) {
                    e.printStackTrace();
                 }
            }
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
