package com.userPointService.processor;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.security.EmailNormalization;
import com.common.data.gamification.Favorite;
import com.common.data.user.UserPoint;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.userPointService.dto.VideoDTO;
import com.userPointService.dto.gamification.FavoriteDTO;
import com.userPointService.mapper.FavoriteMapper;
import com.common.mapper.UserPointMapper;
import com.userPointService.service.UserPointAccessService;
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
    @Autowired
    private UserPointAccessService userPointAccessService;

    @Transactional
    public Mono<ResponseDTO> fetchVideos(String topic, String email, String principalEmail) {
        userPointAccessService.requireCanAccess(principalEmail, email);
        String emailStored = encryptDecryptConverter.storageForm(EmailNormalization.normalize(email));

        return gamificationService.fetchVideos(topic)
                .map(json -> json.get("items"))
                .flatMapMany(Flux::fromIterable)
                .filter(this::isEducational)
                .collectList()
                .flatMap(videoItems -> {
                    List<String> videoIds = videoItems.stream()
                            .map(item -> {
                                JsonNode idNode = item.path("id");
                                return idNode.isObject() ? idNode.path("videoId").asText() : idNode.asText();
                            })
                            .toList();
                    Favorite favorite = new Favorite();
                    favorite.setVideoIds(videoIds);
                    favorite.setEmail(emailStored);
                    List<Favorite> favorites = gamificationService.findByEmailAndVideoIdIn(favorite);

                    List<String> favoriteVideoIds = favorites.stream()
                            .map(Favorite::getVideoId)
                            .toList();

                    List<VideoDTO> videoList = videoItems.stream()
                            .map(item -> mapSearchToDTO(item, favoriteVideoIds))
                            .sorted((v1, v2) -> v1.getTitle().compareToIgnoreCase(v2.getTitle()))
                            .toList();

                    return Mono.just(new ResponseDTO(videoList, ActivityHttpStatus.OK.value(), new ArrayList<>()));
                });
    }

    private VideoDTO mapSearchToDTO(JsonNode item, List<String> favoriteVideoIds) {
        JsonNode idNode = item.path("id");
        String videoId = idNode.isObject() ? idNode.path("videoId").asText() : idNode.asText();
        JsonNode snippet = item.path("snippet");

        boolean isFavorite = favoriteVideoIds.contains(videoId);

        return new VideoDTO(
                videoId,
                snippet.path("title").asText(""),
                snippet.path("description").asText(""),
                snippet.path("thumbnails").path("medium").path("url").asText(""),
                snippet.path("channelTitle").asText(""),
                isFavorite);
    }

    private VideoDTO mapVideosToDTO(JsonNode item) {
        String videoId;
        JsonNode idNode = item.path("id");

        if (idNode.isObject()) {
            videoId = idNode.path("videoId").asText();
        } else {
            videoId = idNode.asText();
        }

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

    private boolean isEducational(JsonNode v) {
        return true;
    }

    public Mono<ResponseDTO> saveFavorite(FavoriteDTO favoriteDTO, String principalEmail) {
        return Mono.fromCallable(() -> {
            userPointAccessService.requireCanAccess(principalEmail, favoriteDTO.getEmail());
            Favorite favorite = favoriteMapper.fromDTO(favoriteDTO);
            favorite = gamificationService.saveFavorite(favorite);
            FavoriteDTO result = favoriteMapper.toDTO(favorite);
            return new ResponseDTO(result,
                    ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    public Mono<ResponseDTO> deleteFavorite(FavoriteDTO favoriteDTO, String principalEmail) {
        return Mono.fromCallable(() -> {
            userPointAccessService.requireCanAccess(principalEmail, favoriteDTO.getEmail());
            Favorite favorite = favoriteMapper.fromDTO(favoriteDTO);
            favorite = gamificationService.deleteFavorite(favorite);
            FavoriteDTO result = favoriteMapper.toDTO(favorite);
            return new ResponseDTO(result,
                    ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    public Mono<ResponseDTO> fetchVideosFavorites(String topic, String email, String principalEmail) {
        userPointAccessService.requireCanAccess(principalEmail, email);
        String emailStored = encryptDecryptConverter.storageForm(EmailNormalization.normalize(email));

        return gamificationService.fetchVideosFavorites(emailStored)
                .map(json -> json.get("items"))
                .flatMapMany(Flux::fromIterable)
                .map(this::mapVideosToDTO)
                .filter(this::isEducational)
                .filter(video -> matchesYouTubeLogic(video, topic))
                .collectList()
                .map(videoList -> {
                    videoList.sort((v1, v2) -> v1.getTitle().compareToIgnoreCase(v2.getTitle()));

                    return new ResponseDTO(videoList, ActivityHttpStatus.OK.value(), new ArrayList<>());
                });
    }

    private boolean matchesYouTubeLogic(VideoDTO video, String topic) {
        if (topic == null || topic.isBlank() || topic.equalsIgnoreCase("tutorial")
                || topic.equalsIgnoreCase("corso") || topic.equalsIgnoreCase("tutorial corso")) {
            return true;
        }
        String title = video.getTitle().toLowerCase();
        String description = video.getDescription() != null ? video.getDescription().toLowerCase() : "";
        String t = topic.toLowerCase();
        boolean containsTopic = title.contains(t) || description.contains(t);

        return containsTopic;
    }
}
