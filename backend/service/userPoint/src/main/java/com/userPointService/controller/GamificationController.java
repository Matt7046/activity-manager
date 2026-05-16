package com.userPointService.controller;

import com.userPointService.dto.gamification.FavoriteDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.security.ReactiveJwt;
import com.userPointService.processor.GamificationProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/gamification")
public class GamificationController {
    @Autowired
    private GamificationProcessor processor;
    @Autowired
    private ReactiveJwt reactiveJwt;

    @GetMapping("videos/{topic}/{email}")
    public Mono<ResponseDTO> fetchVideos(@PathVariable String topic, @PathVariable String email) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> processor.fetchVideos(topic, email, principal));
    }

    @PostMapping("videos/favorite")
    public Mono<ResponseDTO> saveFavorite(@RequestBody FavoriteDTO favorite) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> processor.saveFavorite(favorite, principal));
    }

    @DeleteMapping("videos/favorite")
    public Mono<ResponseDTO> deleteFavorite(@RequestBody FavoriteDTO favorite) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> processor.deleteFavorite(favorite, principal));
    }

    @GetMapping("videos/favorite/{topic}/{email}")
    public Mono<ResponseDTO> fetchVideosFavorites(@PathVariable String topic, @PathVariable String email) {
        return reactiveJwt.currentSubject()
                .flatMap(principal -> processor.fetchVideosFavorites(topic, email, principal));
    }

}
