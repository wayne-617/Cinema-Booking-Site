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


@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

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

        return userRepository.save(newUser);
    }

    
}
