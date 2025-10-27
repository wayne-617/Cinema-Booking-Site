package com.example.demo.controller;

import com.example.demo.dto.ProfileResponseDTO;
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
    public ProfileResponseDTO getProfile(@PathVariable Long userId) {
        return profileService.getProfileByUserId(userId);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<String> updateProfile(
            @PathVariable Long userId,
            @RequestBody ProfileUpdateRequestDTO updateDto
    ) {
        // safety
        if (!userId.equals(updateDto.getUserId())) {
            return ResponseEntity.badRequest().body("userId mismatch");
        }

        profileService.updateProfile(userId, updateDto);
        return ResponseEntity.ok("Profile updated");
    }
}
