package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.service.SettingsService;

import org.springframework.web.bind.annotation.RequestBody;
import java.util.Map;


@RestController
@RequestMapping("/settings")
@CrossOrigin(origins = "http://localhost:3000")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping("/fee")
    public double getFee() {
        return settingsService.getOnlineFee();
    }

    @PutMapping("/fee")
    public void updateFee(@RequestBody Map<String, Double> req) {
        settingsService.updateOnlineFee(req.get("fee"));
    }
}
