package com.example.demo.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import com.example.demo.entity.UserEntity;
import com.example.demo.repository.UserRepository;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private String secretKey = "long_jwt_secret_key_for_32_characters_minimum";
    private long expirationTime = 1000 * 60 * 60; // 1 hour
    private final UserRepository userRepository;

    public JwtUtil(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(String username) {

        UserEntity user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
            
        return Jwts.builder()
                .setSubject(username)
                .claim("role", user.getRole())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey())
                .compact();
    }

    public boolean validateToken(String token, String username) {
        try {
            String tokenUsername = extractUsername(token);
            return (tokenUsername.equals(username) && !isTokenExpired(token));
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        return Jwts.parserBuilder().
            setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
    }

    private boolean isTokenExpired(String token) {
        return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getExpiration()
            .before(new Date());
    }

}
