package com.example.demo.controller;

import com.example.demo.dto.ProfileResponseDTO;
import com.example.demo.dto.ProfileUpdateRequestDTO;
// --- IMPORT THE CORRECT DTO ---
import com.example.demo.dto.ProfileUpdateRequestDTO; 
import com.example.demo.service.ProfileService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin(origins = "http://localhost:3000") 
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    // GET /api/profile/{userId}
    @GetMapping("/{userId}")
    public ResponseEntity<ProfileResponseDTO> getProfile(@PathVariable Long userId) {
        ProfileResponseDTO profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<String> updateProfile(
            @PathVariable Long userId,
            // --- USE THE CORRECT DTO FROM THE CANVAS ---
            @RequestBody ProfileUpdateRequestDTO updateDto
    ) {
        
        // The service will handle all the update logic
        try {
            profileService.updateProfile(userId, updateDto);
            return ResponseEntity.ok("Profile updated successfully.");
        } catch (IllegalArgumentException e) {
            // e.g., if password doesn't match or user not found
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // Catch other potential errors
            return ResponseEntity.status(500).body("An internal error occurred.");
        }
    }
}
