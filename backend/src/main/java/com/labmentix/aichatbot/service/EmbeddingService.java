package com.labmentix.aichatbot.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class EmbeddingService {

    private final WebClient webClient;

    @Value("${huggingface.api.key:}")
    private String hfApiKey;

    public EmbeddingService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(
                "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2")
                .build();
    }

    public Mono<double[]> getEmbedding(String text) {
        return this.webClient.post()
                .header("Authorization", "Bearer " + hfApiKey)
                .bodyValue(new HFRequest(text))
                .retrieve()
                .bodyToMono(double[].class)
                .onErrorResume(e -> {
                    System.err.println("Error fetching embedding: " + e.getMessage());
                    return Mono.just(new double[384]); // Return empty vector on error
                });
    }

    private static class HFRequest {
        public String inputs;

        public HFRequest(String inputs) {
            this.inputs = inputs;
        }
    }
}
