package com.userPointService.controller;

import com.common.data.gamification.Favorite;
import com.common.dto.gamification.FavoriteDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.userPointService.processor.GamificationProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/gamification")
public class GamificationController {
    @Autowired
    private GamificationProcessor processor;

    @GetMapping("videos/{topic}/{email}")
    public Mono<ResponseDTO> fetchVideos(@PathVariable String topic, @PathVariable String email) {
        return processor.fetchVideos(topic, email);
    }

    @PostMapping("videos/favorite")
    public Mono<ResponseDTO> saveFavorite(@RequestBody FavoriteDTO favorite) {
        return processor.saveFavorite(favorite);
    }

    @DeleteMapping("videos/favorite")
    public Mono<ResponseDTO> deleteFavorite(@RequestBody FavoriteDTO favorite) {
        return processor.deleteFavorite(favorite);
    }

    @GetMapping("videos/favorite/{topic}/{email}")
    public Mono<ResponseDTO> fetchVideosFavorites(@PathVariable String topic, @PathVariable String email) {
        return processor.fetchVideosFavorites(topic, email);
    }

}
