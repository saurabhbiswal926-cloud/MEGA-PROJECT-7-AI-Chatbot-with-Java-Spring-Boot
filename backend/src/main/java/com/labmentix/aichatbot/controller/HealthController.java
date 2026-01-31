package com.labmentix.aichatbot.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/")
    public String health() {
        return "OK";
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "Healthy";
    }
}
