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
import com.example.demo.dto.UserAdminDTO;
import com.example.demo.entity.BillingEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.entity.Role;

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

            // Authenticate user
            Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserEntity userEntity = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

            // If not verified, stop here
            if (!userEntity.getEnabled()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "User not verified"));
            }

            // Generate JWT
            String jwt = jwtUtil.generateToken(request.getUsername());

            // FRONTEND NEEDS THIS STRUCTURE
            Map<String, Object> response = Map.of(
                "token", jwt,
                "user", Map.of(
                    "id", userEntity.getId(),
                    "username", userEntity.getUsername(),
                    "firstName", userEntity.getFullName(),
                    "fullName", userEntity.getFullName(),
                    "phone", userEntity.getPhone(),
                    "role", userEntity.getRole(),
                    "enabled", userEntity.getEnabled()
                )
            );

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Password incorrect"));
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Username not found"));
        } catch (Exception e) {
            e.printStackTrace();
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
        

        // 2Register user first
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

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            var users = userRepository.findAll().stream()
                    .map(u -> new UserAdminDTO(
                            u.getId(),
                            u.getUsername(),
                            u.getFullName(),
                            u.getPhone(),
                            u.getRole().name(),
                            u.getEnabled(),
                            u.getPromoOptIn(),
                            u.getHomeAddress()
                    ))
                    .toList();

            return ResponseEntity.ok(users);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to load users"));
        }
    }


    @PutMapping("/users/{id}/status") 
    public ResponseEntity<?> updateUserStatus(
        @PathVariable Long id,
        @RequestBody Map<String, Object> payload) {

        try {
            UserEntity user = userRepository.findById(id).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            // expect {"enabled": true/false}
            Object enabledObj = payload.get("enabled");
            if (enabledObj == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Missing 'enabled' field"));
            }

            boolean newEnabled = Boolean.parseBoolean(enabledObj.toString());

            // Optional: protect admins from being suspended
            if (!newEnabled && user.getRole() == Role.ADMIN) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Cannot suspend admin users"));
            }

            user.setEnabled(newEnabled);

            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "User status updated"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user status"));
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {

        try {
            UserEntity user = userRepository.findById(id).orElse(null);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            Object roleObj = payload.get("role");
            if (roleObj == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Missing 'role' field"));
            }

            String roleStr = roleObj.toString().toUpperCase();

            Role newRole;
            try {
                newRole = Role.valueOf(roleStr);
            } catch (IllegalArgumentException ex) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid role: " + roleStr));
            }

            user.setRole(newRole);
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "User role updated"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user role"));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> adminUpdateUser(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload) {

        try {
            // Find user by ID (admin is editing some other account)
            UserEntity userEntity = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("User not found: " + id));

            // Convert payload values to strings so we can use the same style checks
            String fullName    = payload.get("fullName")    != null ? payload.get("fullName").toString()    : null;
            String phone       = payload.get("phone")       != null ? payload.get("phone").toString()       : null;
            String homeAddress = payload.get("homeAddress") != null ? payload.get("homeAddress").toString() : null;
            Object promoObj    = payload.get("promoOptIn");

            // ---- mimic /auth/update behaviour: only update if not null AND not empty ----

            if (phone != null && !phone.isEmpty()) {
                userEntity.setPhone(phone);
            }

            if (fullName != null && !fullName.isEmpty()) {
                userEntity.setFullName(fullName);
            }

            if (homeAddress != null && !homeAddress.isEmpty()) {
                userEntity.setHomeAddress(homeAddress);
            }

            if (promoObj != null) {
                // accepts true/false or "true"/"false"
                boolean promoBool = Boolean.parseBoolean(promoObj.toString());
                userEntity.setPromoOptIn(promoBool);
            }

            userRepository.save(userEntity);

            // send updated user info back to frontend
            UserAdminDTO dto = new UserAdminDTO(
                    userEntity.getId(),
                    userEntity.getUsername(),
                    userEntity.getFullName(),
                    userEntity.getPhone(),
                    userEntity.getRole().name(),
                    userEntity.getEnabled(),
                    userEntity.getPromoOptIn(),
                    userEntity.getHomeAddress()
            );

            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update user"));
        }
    }
}
