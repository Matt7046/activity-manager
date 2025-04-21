package com.imageService.processor;

import com.cloudinary.Cloudinary;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.dto.image.UploadResultDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.structure.status.ActivityHttpStatus;
import com.common.dto.structure.ImageDTO;
import com.imageService.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;
import java.io.IOException;
import java.util.ArrayList;

@Component
public class ImageProcessor {

    @Autowired
    ImageService imageService;
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    public Mono<ResponseDTO> uploadImage(ImageDTO image ) throws IOException {
        image.setNameImage(encryptDecryptConverter.decrypt(image.getNameImage()));
            return DataBufferUtils.join(image.getFile().content())
                    .flatMap(dataBuffer -> {
                        byte[] bytes = new byte[dataBuffer.readableByteCount()];
                        dataBuffer.read(bytes);
                        DataBufferUtils.release(dataBuffer); // libera la memoria buffer
                        return Mono.just(bytes);
                    })
                    .flatMap(bytes -> {
                        try {
                           UploadResultDTO result =  imageService.uploadImage(image, bytes);
                            return Mono.just(new ResponseDTO(result, ActivityHttpStatus.OK.value(), new ArrayList<>()));
                        } catch (IOException e) {
                            return Mono.error(e);
                        }
                    });
        }
}
