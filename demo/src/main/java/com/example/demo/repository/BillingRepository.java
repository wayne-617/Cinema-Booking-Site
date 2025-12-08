package com.example.demo.repository;

import com.example.demo.entity.BillingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillingRepository extends JpaRepository<BillingEntity, Long> {
    // BillingEntity primary key = uid (bigint auto_increment)
    // Look up billing by the foreign key user_id.
    // Your BillingEntity must have a field named userId mapped to billing.user_id.

    List<BillingEntity> findAllByUser_Id(Long userId);
    
    @Modifying
    @Query("UPDATE BillingEntity b SET b.isDefault = false WHERE b.user.id = :userId")
    void clearDefaultForUser(Long userId);
    

    
    
}
