package com.example.demo.controller;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import com.example.demo.service.UserService;
import com.example.demo.util.JwtUtil;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.JwtResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.UserEntity;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.example.demo.service.ResetService;
import org.springframework.security.crypto.password.PasswordEncoder;
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    UserRepository userRepository;

    @Autowired
    private ResetService resetService;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            System.out.println("Attempting to authenticate user: " + request.getUsername());
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            String jwt = jwtUtil.generateToken(request.getUsername());
            return ResponseEntity.ok(new JwtResponse(jwt));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Password incorrect"));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Username not found"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Login failed");
        }
        }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
             userService.register(
            request.getUsername(),
            request.getPassword(),
            request.getFullName(),  // add full name
            request.getPhone()      // add phone number
        );
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PostMapping("/reset")
    public ResponseEntity<String> reset(@RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            resetService.handleReset(email);
           return ResponseEntity.ok("Link sent if email exists");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Reset Failed");
        }
    }

    @GetMapping("/{email}")
    public ResponseEntity<UserDetails> getUser(@PathVariable String email) {
        UserDetails user = userService.loadUserByUsername(email);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/update")
    public ResponseEntity<UserEntity> updatePassword(@RequestBody Map<String, String> payload) {
         try {
            String username = payload.get("username");
            String password = payload.get("password");
            UserEntity userEntity = userRepository.findByUsername(username)
             .orElseThrow(() -> new RuntimeException("User not found"));
            
            
             userEntity.setUsername(username);
             userEntity.setPassword(passwordEncoder.encode(password));
             userRepository.save(userEntity);
         
           return ResponseEntity.ok(userEntity);
         } catch (Error e) {
             e.printStackTrace();
              return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
         }
    }
}
