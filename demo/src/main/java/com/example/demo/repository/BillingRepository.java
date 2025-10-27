package com.example.demo.repository;

import com.example.demo.entity.BillingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BillingRepository extends JpaRepository<BillingEntity, Long> {
    // BillingEntity primary key = uid (bigint auto_increment)
    // Look up billing by the foreign key user_id.
    // Your BillingEntity must have a field named userId mapped to billing.user_id.

    Optional<BillingEntity> findByUser_Id(Long userId);
}
