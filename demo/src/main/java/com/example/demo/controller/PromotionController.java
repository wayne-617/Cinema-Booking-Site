package com.example.demo.controller;

import com.example.demo.dto.PromotionDTO;
import com.example.demo.entity.PromotionEntity;
import com.example.demo.service.PromotionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final PromotionService promotionService;

    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @PostMapping
    public ResponseEntity<PromotionDTO> createPromotion(@RequestBody PromotionDTO dto) {
        PromotionEntity created = promotionService.createPromotion(dto);
        PromotionDTO out = new PromotionDTO(created.getId(), created.getTitle(), created.getDescription(), created.getCode(), created.getDiscount(), created.getActive());
        return ResponseEntity.status(HttpStatus.CREATED).body(out);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PromotionDTO> editPromotion(@PathVariable Long id, @RequestBody PromotionDTO dto) {
        PromotionEntity updated = promotionService.updatePromotion(id, dto);
        PromotionDTO out = new PromotionDTO(updated.getId(), updated.getTitle(), updated.getDescription(), updated.getCode(), updated.getDiscount(), updated.getActive());
        return ResponseEntity.ok(out);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<PromotionDTO>> listPromotions() {
        List<PromotionDTO> list = promotionService.getAllPromotions();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/code/{code}")
    public ResponseEntity<PromotionDTO> getByCode(@PathVariable String code) {
        PromotionDTO dto = promotionService.getPromotionByCode(code);
        return ResponseEntity.ok(dto);
    }

}
