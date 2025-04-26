package com.imageService.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.common.dto.image.UploadResultDTO;
import com.common.dto.structure.ImageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageService {

    @Autowired
    private Cloudinary cloudinary;

    @Transactional
    public UploadResultDTO uploadImage(ImageDTO image, byte[] bytes) throws IOException {
       Map uploadResult=  cloudinary.uploader().upload(bytes, ObjectUtils.asMap(
                "public_id", image.getNameImage(),
                "overwrite", true,
                "invalidate", true,                 // Invalida la cache CDN
                "transformation", new Transformation().width(image.getWidth()).height(image.getHeight()).crop("fill")
        ));
        UploadResultDTO result = new UploadResultDTO();
        result.setUrl(uploadResult.get("secure_url").toString());
        return result;
    }
}