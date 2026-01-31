package com.labmentix.aichatbot.service;

import com.labmentix.aichatbot.model.KnowledgeDocument;
import com.labmentix.aichatbot.repository.KnowledgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KnowledgeBaseService {

    @Autowired
    private DocumentProcessorService documentProcessor;

    @Autowired
    private EmbeddingService embeddingService;

    @Autowired
    private KnowledgeRepository knowledgeRepository;

    public void processAndStoreDocument(MultipartFile file) throws IOException {
        String fullText = documentProcessor.extractTextFromPdf(file);
        List<String> chunks = documentProcessor.chunkText(fullText, 500, 50);

        for (String chunk : chunks) {
            double[] embedding = embeddingService.getEmbedding(chunk).block(); // Blocking for implementation simplicity

            KnowledgeDocument doc = KnowledgeDocument.builder()
                    .content(chunk)
                    .embedding(embedding)
                    .fileName(file.getOriginalFilename())
                    .build();

            knowledgeRepository.save(doc);
        }
    }

    public String searchContext(String query) {
        double[] queryEmbedding = embeddingService.getEmbedding(query).block();
        if (queryEmbedding == null)
            return "";

        String embeddingStr = Arrays.toString(queryEmbedding);
        List<KnowledgeDocument> similarDocs = knowledgeRepository.findSimilarDocuments(embeddingStr, 3);

        return similarDocs.stream()
                .map(KnowledgeDocument::getContent)
                .collect(Collectors.joining("\n---\n"));
    }
}
