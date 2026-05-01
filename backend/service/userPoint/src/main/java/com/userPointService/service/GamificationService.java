package com.userPointService.service;

import com.common.data.gamification.Favorite;
import com.common.data.user.UserPoint;
import com.common.dto.structure.ResponseDTO;
import com.fasterxml.jackson.databind.JsonNode;
import com.userPointService.repository.FavoriteRepository;
import com.userPointService.repository.UserPointRepository;

import java.util.List;
import java.util.Optional;

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

    @Autowired
    private FavoriteRepository favoriteRepository;

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

    public Favorite saveFavorite(Favorite favorite) {
        Optional<Favorite> favoriteDB = favoriteRepository.findByEmailAndVideoId(favorite.getEmail(),
                favorite.getVideoId());
        // Se NON è presente, allora salviamo
        if (favoriteDB.isEmpty()) {
            favorite = favoriteRepository.save(favorite);
        } else {
            // Se esiste già, restituiamo quello presente nel DB
            favorite = favoriteDB.get();
        }
        return favorite;
    }

    public Favorite deleteFavorite(Favorite favorite) {
        Optional<Favorite> favoriteDB = favoriteRepository.findByEmailAndVideoId(favorite.getEmail(),
                favorite.getVideoId());
        // Se è presente, allora cancelliamo
        if (favoriteDB.isPresent()) {
            favoriteRepository.delete(favoriteDB.get());
            favorite = new Favorite();
        }
        return favorite;
    }

    public Mono<JsonNode> fetchVideosFavorites(String email) {
        List<Favorite> favorites = favoriteRepository.findByEmail(email);
        // 1. Estraiamo gli ID dalla lista di oggetti Favorite
        List<String> videoids = favorites.stream()
                .map(Favorite::getVideoId) // Assumendo che il getter sia getVideoId()
                .toList();
        String idsFormatted = String.join(",", videoids);
        return webClientYoutube.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/videos") // Cambiato da /search a /videos
                        .queryParam("part", "snippet,contentDetails") // Aggiunti dettagli utili
                        .queryParam("id", idsFormatted) // Usiamo il parametro 'id'
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

    public Boolean findByEmailAndVideoId(Favorite favorite) {
        Optional<Favorite> favoriteDB = favoriteRepository.findByEmailAndVideoId(favorite.getEmail(),
                favorite.getVideoId());
        // Se è presente, allora cancelliamo
        return favoriteDB.isPresent();
    }

}