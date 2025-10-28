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
        Optional<BillingEntity> billingOpt = billingRepository.findById(request.getUid());

        BillingEntity billing = billingOpt.orElseGet(BillingEntity::new);

        billing.setExpMonth(request.getExpMonth());
        billing.setExpYear(request.getExpYear());
        billing.setUid(request.getUid());
        billing.setCardType(request.getCardType());
        billing.setLastFour(request.getLastFour());
        billing.setStreet(request.getStreet());
        billing.setCity(request.getCity());
        billing.setZip(request.getZip());

        billingRepository.save(billing);
        return ResponseEntity.ok("billing saved");
       } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
       }
        
        
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<BillingRequest> getBilling(@PathVariable long id) {

        BillingEntity billingEnt = billingRepository.findByUser_Id(id)
            .orElseThrow(() -> new RuntimeException("billing not found: " + id));

        BillingRequest req = new BillingRequest();

        req.setExpMonth(billingEnt.getExpMonth());
        req.setExpYear(billingEnt.getExpYear());
        req.setUid(billingEnt.getUid());
        req.setCardType(billingEnt.getCardType());
        req.setLastFour(billingEnt.getLastFour());
        req.setStreet(billingEnt.getStreet());
        req.setCity(billingEnt.getCity());
        req.setZip(billingEnt.getZip());
        

        

        return ResponseEntity.ok(req);
    }
    

}
