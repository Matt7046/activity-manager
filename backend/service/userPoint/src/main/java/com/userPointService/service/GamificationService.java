package com.userPointService.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class GamificationService {

    @Autowired
    @Qualifier("webClientYoutube")
    private WebClient webClientYoutube;

    @Value("${youtube.api-key}")
    private String apiKey;
 

    public Mono<JsonNode> fetchVideos(String topic) {

        String query = topic + " tutorial corso";

        return webClientYoutube.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("part", "snippet")
                        .queryParam("q", query)
                        .queryParam("type", "video")
                        .queryParam("videoEmbeddable", "true")
                        .queryParam("videoDuration", "medium")
                        .queryParam("maxResults", "16")
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .onStatus(HttpStatusCode::isError, response -> response.bodyToMono(String.class)
                        .flatMap(errorBody -> {
                            System.err.println("Errore API YouTube: " + errorBody);
                            return Mono.error(new RuntimeException("Errore API"));
                        }))
                .bodyToMono(JsonNode.class);
          
    }

   

   
}