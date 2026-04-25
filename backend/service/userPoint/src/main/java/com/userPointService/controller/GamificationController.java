package com.userPointService.controller;

import com.common.dto.structure.ResponseDTO;
import com.userPointService.processor.GamificationProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/gamification")
public class GamificationController {
    @Autowired
    private GamificationProcessor processor;

    @GetMapping("videos/{topic}")
    public Mono<ResponseDTO> fetchVideos(@PathVariable String topic) {
        return processor.fetchVideos(topic);
    }
   
}
