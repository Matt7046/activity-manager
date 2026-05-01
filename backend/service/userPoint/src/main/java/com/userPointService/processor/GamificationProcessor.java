package com.userPointService.processor;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.gamification.Favorite;
import com.common.data.user.UserPoint;
import com.common.dto.gamification.FavoriteDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.structure.VideoDTO;
import com.common.dto.user.UserDTO;
import com.common.dto.user.UserPointDTO;
import com.common.mapper.FavoriteMapper;
import com.common.mapper.UserPointMapper;
import com.common.structure.status.ActivityHttpStatus;
import com.fasterxml.jackson.databind.JsonNode;
import com.userPointService.service.GamificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class GamificationProcessor {

    @Autowired
    private GamificationService gamificationService;
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;
    @Autowired
    private FavoriteMapper favoriteMapper;

    @Transactional
    public Mono<ResponseDTO> fetchVideos(String topicCrypt, String email) {
        String topic = encryptDecryptConverter.decrypt(topicCrypt);

        return gamificationService.fetchVideos(topic)
                .map(json -> json.get("items"))
                .flatMapMany(Flux::fromIterable)
                .map(item -> mapSearchToDTO(item, email))
                .filter(this::isEducational)
                .collectList() // Otteniamo la lista completa
                .map(videoList -> {
                    // Ordinamento alfabetico per titolo (Case-Insensitive)
                    videoList.sort((v1, v2) -> v1.getTitle().compareToIgnoreCase(v2.getTitle()));

                    return new ResponseDTO(videoList, ActivityHttpStatus.OK.value(), new ArrayList<>());
                });
    }

    private VideoDTO mapSearchToDTO(JsonNode item, String email) {
        // Gestione ID sicura (visto che l'id in 'search' è un oggetto)
        JsonNode idNode = item.path("id");
        String videoId = idNode.isObject() ? idNode.path("videoId").asText() : idNode.asText();

        JsonNode snippet = item.path("snippet");

        // Creazione oggetto per il controllo preferiti
        Favorite favorite = new Favorite();
        favorite.setVideoId(videoId);
        favorite.setEmail(email);

        // ATTENZIONE: Se findByEmailAndVideoId chiama un DB bloccante (MongoRepository
        // standard),
        // questa operazione rallenterà il flusso. Se possibile, rendila asincrona.
        Boolean isFavorite = gamificationService.findByEmailAndVideoId(favorite);

        return new VideoDTO(
                videoId,
                snippet.path("title").asText(""),
                snippet.path("description").asText(""),
                snippet.path("thumbnails").path("medium").path("url").asText(""),
                snippet.path("channelTitle").asText(""),
                isFavorite != null && isFavorite); // Gestione null safety per il Boolean
    }

    private VideoDTO mapVideosToDTO(JsonNode item) {
        // 1. Gestione ID: l'endpoint /videos restituisce l'id come stringa diretta,
        // mentre l'endpoint /search lo restituisce come oggetto { "videoId": "..." }
        String videoId;
        JsonNode idNode = item.path("id");

        if (idNode.isObject()) {
            videoId = idNode.path("videoId").asText();
        } else {
            videoId = idNode.asText();
        }

        // 2. Accesso sicuro allo snippet
        JsonNode snippet = item.path("snippet");
        JsonNode thumbnails = snippet.path("thumbnails");

        return new VideoDTO(
                videoId,
                snippet.path("title").asText(),
                snippet.path("description").asText(),
                thumbnails.path("medium").path("url").asText(),
                snippet.path("channelTitle").asText(),
                true);
    }

    private boolean isEducational(VideoDTO v) {
        return true;
    }

    public Mono<ResponseDTO> saveFavorite(FavoriteDTO favoriteDTO) {
        return Mono.fromCallable(() -> {
            Favorite favorite = favoriteMapper.fromDTO(favoriteDTO);
            favorite = gamificationService.saveFavorite(favorite);
            FavoriteDTO result = favoriteMapper.toDTO(favorite);
            return new ResponseDTO(result,
                    ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    public Mono<ResponseDTO> deleteFavorite(FavoriteDTO favoriteDTO) {
        return Mono.fromCallable(() -> {
            Favorite favorite = favoriteMapper.fromDTO(favoriteDTO);
            favorite = gamificationService.deleteFavorite(favorite);
            FavoriteDTO result = favoriteMapper.toDTO(favorite);
            return new ResponseDTO(result,
                    ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    public Mono<ResponseDTO> fetchVideosFavorites(String topicCrypt, String emailCrypt) {
        String topic = encryptDecryptConverter.decrypt(topicCrypt);

        return gamificationService.fetchVideosFavorites(emailCrypt)
                .map(json -> json.get("items"))
                .flatMapMany(Flux::fromIterable)
                .map(this::mapVideosToDTO)
                // Filtro per contenuti educativi (durata/categoria)
                .filter(this::isEducational)
                // Filtro per parole chiave (tutorial/corso) basato sul topic cercato
                .filter(video -> matchesYouTubeLogic(video, topic))
                .collectList()
                .map(videoList -> {
                    // Ordinamento alfabetico per titolo (Case-Insensitive)
                    videoList.sort((v1, v2) -> v1.getTitle().compareToIgnoreCase(v2.getTitle()));

                    return new ResponseDTO(videoList, ActivityHttpStatus.OK.value(), new ArrayList<>());
                });
    }
    private boolean matchesYouTubeLogic(VideoDTO video, String topic) {
        // Se il topic è vuoto, non filtriamo nulla
        if (topic == null || topic.isBlank()) {
            return true;
        }
        String title = video.getTitle().toLowerCase();
        String description = video.getDescription() != null ? video.getDescription().toLowerCase() : "";
        String t = topic.toLowerCase();
        // Verifichiamo se il titolo/descrizione contengono il topic
        // E almeno una delle parole chiave che usi nella query standard
        boolean containsTopic = title.contains(t) || description.contains(t);

        return containsTopic;
    }
}