package com.notificationService.controller;

import com.common.dto.structure.ResponseDTO;
import com.common.dto.user.UserPointDTO;
import com.notificationService.processor.EmailProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@CrossOrigin(origins = "https://webapp-tn6q.onrender.com")
@RequestMapping("api/email")
public class EmailController {

    @Autowired
    private EmailProcessor notificationProcessor;


    @PostMapping("/entity")
    public Mono<ResponseDTO> sendPasswordEmailChild(@RequestBody UserPointDTO userPoint) throws Exception {
        return notificationProcessor.sendPasswordEmailChild(userPoint);
    }
}
