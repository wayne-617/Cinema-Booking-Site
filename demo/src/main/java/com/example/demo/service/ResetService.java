package com.example.demo.service;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class ResetService {
    
    @Autowired
    private JavaMailSender mailSender;

    public void handleReset(String email) {
        String tok = UUID.randomUUID().toString();
        sendReset(email, tok);

    }

    private void sendReset(String recipEmail, String tok) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(recipEmail);
        msg.setSubject("Reset Password");
        String str = "http://localhost:3000/reset?email=" + URLEncoder.encode(recipEmail, StandardCharsets.UTF_8);
        msg.setText("Click here to reset your password:" + str);
        try {
        mailSender.send(msg);
        } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("Sending reset email to: " + recipEmail);
    }
}

