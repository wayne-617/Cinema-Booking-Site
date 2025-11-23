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
import com.example.demo.repository.BillingRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthUserDTO;
import com.example.demo.dto.JwtResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.entity.BillingEntity;
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

            UserEntity userEntity = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

            if (!userEntity.getEnabled()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not verified"));
            }

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
    public ResponseEntity<String> register(@RequestBody Map<String, Object> requestBody) {
    try {
        
        String username = (String) requestBody.get("username");
        String password = (String) requestBody.get("password");
        String fullName = (String) requestBody.get("fullName");
        String phone = (String) requestBody.get("phone");
        Boolean promoOptIn = (Boolean) requestBody.getOrDefault("promoOptIn", false);
        String homeAddress = (String) requestBody.get("homeAddress");
        

        // 2️⃣ Register user first
          Map<String, Object> address = (Map<String, Object>) requestBody.get("address");
        Map<String, Object> paymentInfo = (Map<String, Object>) requestBody.get("paymentInfo");

        String street = address != null ? (String) address.get("street") : null;
        String city = address != null ? (String) address.get("city") : null;
        String state = address != null ? (String) address.get("state") : null;
        String zip = address != null ? (String) address.get("zip") : null;

        String cardType = paymentInfo != null ? (String) paymentInfo.get("cardType") : null;
        String cardNumber = paymentInfo != null ? (String) paymentInfo.get("cardNumber") : null;
        Integer expMonth = paymentInfo != null ? parseIntOrNull(paymentInfo.get("expMonth")) : null;
        Integer expYear = paymentInfo != null ? parseIntOrNull(paymentInfo.get("expYear")) : null;
        
         userService.register(
            username,
            password,
            fullName,
            phone,
            promoOptIn,
            homeAddress,
            street,
            city,
            state,
            zip,
            cardType,
            cardNumber,
            expMonth,
            expYear
        );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Verification email sent. Please check your inbox.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Registration failed: " + e.getMessage());
        }
    }

    private Integer parseIntOrNull(Object value) {
        if (value == null) return null;
        try {
            return Integer.parseInt(value.toString());
        } catch (NumberFormatException e) {
            return null;
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
    public ResponseEntity<AuthUserDTO> getUserForFrontend(@PathVariable String email) {

        UserEntity userEntity = userRepository.findByUsername(email)
            .orElseThrow(() -> new RuntimeException("User not found: " + email));

        AuthUserDTO dto = new AuthUserDTO();
        dto.setId(userEntity.getId());
        dto.setPhone(userEntity.getPhone().toString());
        dto.setName(userEntity.getFullName().toString());
        dto.setPassword(userEntity.getPassword().toString());
        dto.setUsername(userEntity.getUsername());
        dto.setRole(userEntity.getRole().toString());
       
        

        String pw = userEntity.getPassword();
        dto.setPasswordLength(pw == null ? 0 : pw.length());

        return ResponseEntity.ok(dto);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, String> payload) {
        try {
            String username = payload.get("username");
            String currentPassword = payload.get("currentPassword");
            String newPassword = payload.get("newPassword");
            String phone = payload.get("phone");
            String name = payload.get("fullName");
            String promo = payload.get("promoOptIn");
            Boolean promoBool = Boolean.parseBoolean(promo);
            UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

           
            if (currentPassword != null && newPassword != null &&
                !currentPassword.isEmpty() && !newPassword.isEmpty()) {

                if (!passwordEncoder.matches(currentPassword, userEntity.getPassword())) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body(Map.of("error", "Current password is incorrect"));
                }

                userEntity.setPassword(passwordEncoder.encode(newPassword));
            }

            if (phone != null && !phone.isEmpty()) {
                userEntity.setPhone(phone);
            }

            if (name != null && !name.isEmpty()) {
                userEntity.setFullName(name);
            }

            if(promo != null && !promo.isEmpty()) {
                
                userEntity.setPromoOptIn(promoBool);
            }

            userRepository.save(userEntity);

            return ResponseEntity.ok(Map.of("message", "User updated successfully"));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user"));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verify(@RequestParam("email") String email, @RequestParam("token") String token) {
        try {
            userService.verify(email, token); 
            return ResponseEntity.ok("User verified successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
