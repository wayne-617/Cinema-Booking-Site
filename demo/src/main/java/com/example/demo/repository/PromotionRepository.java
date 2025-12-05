package com.example.demo.repository;

import com.example.demo.entity.PromotionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PromotionRepository extends JpaRepository<PromotionEntity, Long> {
    Optional<PromotionEntity> findByCode(String code);
}
