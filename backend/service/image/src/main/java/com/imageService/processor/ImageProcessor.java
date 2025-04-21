package com.imageService.processor;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.dto.structure.ResponseDTO;
import com.imageService.service.ImageService;
import com.common.dto.structure.ImageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.io.IOException;

@Component
public class ImageProcessor {

    @Autowired
    ImageService imageService;
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;


    public Mono<ResponseDTO> uploadImage(ImageDTO imageDTO ) throws IOException {
        imageDTO.setNameImage(encryptDecryptConverter.decrypt(imageDTO.getNameImage()));
        return imageService.uploadImage(imageDTO);
    }
}
