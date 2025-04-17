package com.imageService.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.common.dto.image.UploadResultDTO;
import com.common.dto.structure.ImageDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.structure.status.ActivityHttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

@Service
public class ImageService {

    @Autowired
    private Cloudinary cloudinary;

    public Mono<ResponseDTO> uploadImage(ImageDTO image) {
        return DataBufferUtils.join(image.getFile().content())
                .flatMap(dataBuffer -> {
                    byte[] bytes = new byte[dataBuffer.readableByteCount()];
                    dataBuffer.read(bytes);
                    DataBufferUtils.release(dataBuffer); // libera la memoria buffer
                    return Mono.just(bytes);
                })
                .flatMap(bytes -> {
                    try {
                        Map uploadResult = cloudinary.uploader().upload(bytes, ObjectUtils.asMap(
                                "public_id", image.getNameImage(),
                                "overwrite", true,
                                "invalidate", true,                 // Invalida la cache CDN
                                "transformation", new Transformation().width(image.getWidth()).height(image.getHeight()).crop("fill")
                        ));
                        UploadResultDTO result = new UploadResultDTO();
                        result.setUrl(uploadResult.get("secure_url").toString());
                        return Mono.just(new ResponseDTO(result, ActivityHttpStatus.OK.value(), new ArrayList<>()));
                    } catch (IOException e) {
                        return Mono.error(e);
                    }
                });
    }

}