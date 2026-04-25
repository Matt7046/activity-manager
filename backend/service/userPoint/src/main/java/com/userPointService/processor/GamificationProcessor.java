package com.userPointService.processor;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.structure.VideoDTO;
import com.common.structure.status.ActivityHttpStatus;
import com.fasterxml.jackson.databind.JsonNode;
import com.userPointService.service.GamificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.util.ArrayList;

@Component
public class GamificationProcessor {

    @Autowired
    private GamificationService gamificationService;
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;



    @Transactional
    public Mono<ResponseDTO> fetchVideos(String topicCrypt) {
        String topic = encryptDecryptConverter.decrypt(topicCrypt);
        return gamificationService.fetchVideos(topic)
                .map(json -> json.get("items"))
                .flatMapMany(Flux::fromIterable)
                .map(this::mapToDTO)
                .filter(this::isEducational)
                .collectList() // Qui trasformiamo il Flux in Mono<List<VideoDTO>>
                .map(videoList -> {
                    // Creiamo il ResponseDTO solo quando la lista è pronta
                    return new ResponseDTO(videoList, ActivityHttpStatus.OK.value(), new ArrayList<>());
                });
    }

    private VideoDTO mapToDTO(JsonNode item) {
        String videoId = item.get("id").get("videoId").asText();
        JsonNode snippet = item.get("snippet");

        return new VideoDTO(
                videoId,
                snippet.get("title").asText(),
                snippet.get("description").asText(),
                snippet.get("thumbnails").get("medium").get("url").asText(),
                snippet.get("channelTitle").asText());
    }

    private boolean isEducational(VideoDTO v) {
       return true;
    }
}