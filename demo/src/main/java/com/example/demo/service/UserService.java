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
import com.example.demo.entity.Role;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.UserRepository;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.MailException;
import org.springframework.transaction.annotation.Transactional;
import java.util.Random;


@Service
public class UserService implements UserDetailsService {

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

    public UserEntity register(String username, String password, String fullName, String phone) {
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

        UserEntity savedUser = userRepository.save(newUser);

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
    
}
