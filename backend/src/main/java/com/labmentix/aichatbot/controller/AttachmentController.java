package com.labmentix.aichatbot.controller;

import com.labmentix.aichatbot.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/attachments")
public class AttachmentController {

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String url = fileStorageService.uploadFile(file);
            return ResponseEntity.ok(Map.of(
                    "url", url,
                    "type", file.getContentType(),
                    "name", file.getOriginalFilename()));
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
        }
    }
}
