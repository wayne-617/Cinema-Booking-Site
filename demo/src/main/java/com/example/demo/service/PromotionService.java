package com.example.demo.service;

import com.example.demo.dto.PromotionDTO;
import com.example.demo.entity.PromotionEntity;
import com.example.demo.repository.PromotionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PromotionService {

    private final PromotionRepository promotionRepository;
    private final UserService userService;

    public PromotionService(PromotionRepository promotionRepository, UserService userService) {
        this.promotionRepository = promotionRepository;
        this.userService = userService;
    }

    public PromotionEntity createPromotion(PromotionDTO dto) {
        PromotionEntity p = new PromotionEntity();
        p.setTitle(dto.getTitle());
        p.setDescription(dto.getDescription());
        p.setCode(dto.getCode());
        p.setDiscount(dto.getDiscount());
        p.setActive(dto.getActive() == null ? Boolean.TRUE : dto.getActive());
        PromotionEntity saved = promotionRepository.save(p);

        // If requested, send email alerts to opted-in users (not persisted on promotion)
        if (dto.getSendEmail() != null && dto.getSendEmail()) {
            System.out.println("Sending promotion emails for promotion ID " + saved.getId());
            try {
                userService.sendPromotionEmails(saved.getTitle(), saved.getDescription(), saved.getCode());
            } catch (Exception ex) {
                // don't fail creation if email sending fails; just log
                ex.printStackTrace();
            }
        }

        return saved;
    }

    public PromotionEntity updatePromotion(Long id, PromotionDTO dto) {
        PromotionEntity p = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found: " + id));
        if (dto.getTitle() != null) p.setTitle(dto.getTitle());
        if (dto.getDescription() != null) p.setDescription(dto.getDescription());
        if (dto.getCode() != null) p.setCode(dto.getCode());
        if (dto.getDiscount() != null) p.setDiscount(dto.getDiscount());
        if (dto.getActive() != null) p.setActive(dto.getActive());
        return promotionRepository.save(p);
    }

    public void deletePromotion(Long id) {
        if (!promotionRepository.existsById(id)) {
            throw new RuntimeException("Promotion not found: " + id);
        }
        promotionRepository.deleteById(id);
    }

    public List<PromotionDTO> getAllPromotions() {
        return promotionRepository.findAll().stream()
                .map(e -> new PromotionDTO(e.getId(), e.getTitle(), e.getDescription(), e.getCode(), e.getDiscount(), e.getActive()))
                .collect(Collectors.toList());
    }

    public PromotionDTO getPromotionByCode(String code) {
        PromotionEntity e = promotionRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Promotion not found: " + code));
        return new PromotionDTO(e.getId(), e.getTitle(), e.getDescription(), e.getCode(), e.getDiscount(), e.getActive());
    }

}
