package com.example.demo.dto;

public record PromotionDTO(
        Long id,
        String title,
        String description,
        String code,
        Integer discount,
        Boolean active
) {}
