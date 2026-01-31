package com.labmentix.aichatbot.controller;

import com.labmentix.aichatbot.dto.AnalyticsDTO;
import com.labmentix.aichatbot.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/stats")
    public ResponseEntity<AnalyticsDTO> getStats() {
        return ResponseEntity.ok(analyticsService.getStats());
    }
}
