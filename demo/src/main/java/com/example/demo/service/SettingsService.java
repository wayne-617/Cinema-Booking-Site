package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entity.SystemSettings;
import com.example.demo.repository.SystemSettingsRepository;

@Service
public class SettingsService {
    @Autowired private SystemSettingsRepository repo;


    public double getOnlineFee() {
        return repo.findById(1L).map(SystemSettings::getOnlineFee).orElse(2.50);
    }

    public void updateOnlineFee(double fee) {
        SystemSettings s = repo.findById(1L).orElseGet(() -> {
            SystemSettings ss = new SystemSettings();
            ss.setId(1L);   // REQUIRED
            return ss;
        });

        s.setOnlineFee(fee);
        repo.save(s);
    }
}
