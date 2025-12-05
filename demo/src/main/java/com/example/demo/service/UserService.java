package com.example.demo.service;

import java.util.ArrayList;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.config.PasswordEncoderConfig;
import com.example.demo.entity.BillingEntity;
import com.example.demo.entity.Role;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.BillingRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailException;
import org.springframework.transaction.annotation.Transactional;
import java.util.Random;


@Service
public class UserService implements UserDetailsService {

    @Autowired
    private BillingService billingService;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public UserDetails loadUserByUsername(String username) {

        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new org.springframework.security.core.userdetails.User(
                userEntity.getUsername(),
                userEntity.getPassword(),
                new ArrayList<>()
        );
    }

        public UserEntity register(
            String username,
            String password,
            String fullName,
            String phone,
            Boolean promoOptIn,
            String homeAddress,
            String street,
            String city,
            String state,
            String zip,
            String cardType,
            String cardNumber,
            Integer expMonth,
            Integer expYear
        ) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        password = passwordEncoder.encode(password);

        UserEntity newUser = new UserEntity();
        newUser.setUsername(username);
        newUser.setPassword(password);
        newUser.setFullName(fullName);
        newUser.setPhone(phone);
        newUser.setRole(Role.CUSTOMER);
        newUser.setEnabled(false);
        String verificationToken = String.format("%06d", new Random().nextInt(999999));
        newUser.setVerificationToken(verificationToken);
        newUser.setPromoOptIn(promoOptIn);
        newUser.setHomeAddress(homeAddress);

        UserEntity savedUser = userRepository.save(newUser);

            // --- 2️⃣ Create Billing record (AFTER user is saved) ---
        BillingEntity billing = new BillingEntity();
        billing.setUser(savedUser);

        // Split name for convenience
        String[] nameParts = fullName.trim().split(" ", 2);
        billing.setFirstName(nameParts[0]);
        billing.setLastName(nameParts.length > 1 ? nameParts[1] : "");

        // Email for reference
        billing.setEmail(username);

        // Address info
        billing.setStreet(street);
        billing.setCity(city);
        billing.setState(state);
        billing.setZip(zip);

        // Payment info
        billing.setCardType(cardType);
        billing.setCardNumber(cardNumber); // full number (not last four)
        billing.setExpMonth(expMonth);
        billing.setExpYear(expYear);

        billingService.saveBilling(billing);



        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(username);
            message.setSubject("Email Verification");
            message.setText("Your verification code is: " + verificationToken);
            mailSender.send(message);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return savedUser;

    }

    @Transactional
    public UserEntity verify(String email, String token) {
        UserEntity user = userRepository.findByUsername(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getVerificationToken().equals(token)) {
            user.setEnabled(true);
            user.setVerificationToken(null);
            userRepository.save(user);
            return user;
        } else {
            throw new RuntimeException("Invalid verification token");
        }
    }
    
    public void sendPromotionEmails(String title, String description, String code) {
        java.util.List<UserEntity> recipients = userRepository.findByPromoOptInTrue();
        System.out.println("Found " + (recipients != null ? recipients.size() : 0) + " users opted in for promotions.");
        if (recipients == null || recipients.isEmpty()) {
            java.util.List<UserEntity> all = userRepository.findAll();
            for (UserEntity u : all) {
                Boolean optIn = u.getPromoOptIn();
                System.out.println(String.format("User id=%s username=%s promoOptIn=%s", u.getId(), u.getUsername(), String.valueOf(optIn)));
                if (optIn != null && optIn.booleanValue()) {
                    // add to recipients list
                    if (recipients == null) recipients = new java.util.ArrayList<>();
                    recipients.add(u);
                }
            }
        }

        if (recipients == null || recipients.isEmpty()) {
            System.out.println("No recipients to send promotion emails to after fallback scan.");
            return;
        }

        for (UserEntity u : recipients) {
            System.out.println("Sending promo email to: " + u.getUsername() + " (id=" + u.getId() + ")");
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(u.getUsername()); // username is email
                message.setSubject(title != null ? title : "Promotion");
                StringBuilder sb = new StringBuilder();
                if (description != null) sb.append(description).append("\n\n");
                if (code != null) sb.append("Code: ").append(code).append("\n");
                message.setText(sb.toString());
                mailSender.send(message);
            } catch (Exception e) {
                // log and continue
                e.printStackTrace();
            }
        }
    }
    
}
