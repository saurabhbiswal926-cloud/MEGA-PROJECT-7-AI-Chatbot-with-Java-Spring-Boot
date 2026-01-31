package com.labmentix.aichatbot.controller;

import com.labmentix.aichatbot.service.KnowledgeBaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/knowledge")
public class KnowledgeBaseController {

    @Autowired
    private KnowledgeBaseService knowledgeBaseService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadDocument(@RequestParam("file") MultipartFile file) {
        try {
            knowledgeBaseService.processAndStoreDocument(file);
            return ResponseEntity.ok("Document processed and added to knowledge base.");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error processing document: " + e.getMessage());
        }
    }
}
