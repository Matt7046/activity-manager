package com.imageService.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.codec.multipart.FilePart;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageDTO {
    String nameImage;
    FilePart file;
    Integer width;
    Integer height;
    /** Slot card (0, 1, 2) se nameImage non è in form. */
    String imageCardId;
    /** Email bambino in chiaro (fallback per public_id). */
    String email;
}
