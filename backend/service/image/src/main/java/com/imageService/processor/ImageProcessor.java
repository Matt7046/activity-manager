package com.imageService.processor;

import com.imageService.dto.UploadResultDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.structure.status.ActivityHttpStatus;
import com.imageService.dto.ImageDTO;
import com.common.structure.exception.BadRequestException;
import com.common.structure.messages.ImageMessages;
import com.common.user.UserPointImageSlots;
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
    ImageMessages imageMessages;
    @Autowired
    UserPointImageSlots userPointImageSlots;

    public Mono<ResponseDTO> uploadImage(ImageDTO image) {
        String publicId;
        try {
            publicId = userPointImageSlots.resolvePublicId(
                    image.getNameImage(),
                    image.getEmail(),
                    image.getImageCardId());
        } catch (BadRequestException ex) {
            return Mono.error(ex);
        }
        if (publicId == null || publicId.isBlank()) {
            return Mono.error(new BadRequestException(imageMessages.uploadSlotRequired()));
        }
        image.setNameImage(publicId);
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
