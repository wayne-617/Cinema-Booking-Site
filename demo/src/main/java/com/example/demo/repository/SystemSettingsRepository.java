package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.SystemSettings;

public interface SystemSettingsRepository extends JpaRepository<SystemSettings, Long> {

}
