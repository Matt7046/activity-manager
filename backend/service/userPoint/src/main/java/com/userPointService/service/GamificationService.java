package com.userPointService.service;

import com.common.dto.structure.VideoDTO;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.List;

@Service
public class GamificationService {

    @Autowired
    @Qualifier("webClientYoutube")
    private WebClient webClientYoutube;

    @Value("${youtube.api-key}")
    private String apiKey;
 

    public Mono<JsonNode> fetchVideos(String topic) {

        String query = topic + " tutorial course";

        return webClientYoutube.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/search")
                        .queryParam("part", "snippet")
                        .queryParam("q", query)
                        .queryParam("type", "video")
                        .queryParam("videoEmbeddable", "true")
                        .queryParam("videoDuration", "medium")
                        .queryParam("maxResults", "15")
                        .queryParam("key", apiKey)
                        .build())
                .retrieve()
                .bodyToMono(JsonNode.class);
          
    }

   

   
}