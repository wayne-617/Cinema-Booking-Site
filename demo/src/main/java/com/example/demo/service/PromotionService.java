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

    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    public PromotionEntity createPromotion(PromotionDTO dto) {
        PromotionEntity p = new PromotionEntity();
        p.setTitle(dto.title());
        p.setDescription(dto.description());
        p.setCode(dto.code());
        p.setDiscount(dto.discount());
        p.setActive(dto.active() == null ? Boolean.TRUE : dto.active());
        return promotionRepository.save(p);
    }

    public PromotionEntity updatePromotion(Long id, PromotionDTO dto) {
        PromotionEntity p = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Promotion not found: " + id));
        if (dto.title() != null) p.setTitle(dto.title());
        if (dto.description() != null) p.setDescription(dto.description());
        if (dto.code() != null) p.setCode(dto.code());
        if (dto.discount() != null) p.setDiscount(dto.discount());
        if (dto.active() != null) p.setActive(dto.active());
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
