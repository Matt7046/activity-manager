package com.registerService.controller;

import com.registerService.service.UserWebService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.common.dto.UserPointDTO;
import com.common.dto.ResponseDTO;
import reactor.core.publisher.Mono;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "https://webapp-tn6q.onrender.com")
@RequestMapping("api/register")
public class RegisterController {

        @Autowired
        private UserWebService userWebService;

        @PostMapping("/dati")
        public Mono<ResponseDTO> saveUserByPoints(@RequestBody UserPointDTO userPointDTO) {
            return userWebService.saveUserByPoints(userPointDTO);
        }
}
