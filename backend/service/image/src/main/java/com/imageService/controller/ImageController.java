package com.imageService.controller;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.imageService.processor.ImageProcessor;
import com.common.dto.structure.ImageDTO;
import com.common.dto.structure.ResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.io.IOException;

@RestController
@RequestMapping("/api/image")
public class ImageController {

    @Autowired
    private ImageProcessor imageProcessor;
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    @PostMapping("/upload" )
    public Mono<ResponseDTO> upload(@ModelAttribute ImageDTO image) throws IOException {
        Mono<ResponseDTO> result = imageProcessor.uploadImage(image);
        return result;
    }
}
