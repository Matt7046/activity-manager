package com.common.mapper;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.dto.auth.Point;
import com.common.dto.user.PointDTO;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class PointMapper {
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    @Mapping(target = "nameImage", ignore = true)
    public abstract PointDTO toDTO(Point point);

    @Mapping(target = "nameImages", ignore = true)
    public abstract Point fromDTO(PointDTO dto);

    @AfterMapping
    protected void decryptField(Point point, @MappingTarget PointDTO dto) {
        if (point.getEmail() != null && !point.getEmail().isBlank()) {
            dto.setEmail(encryptDecryptConverter.decrypt(point.getEmail()));
        }
        if (point.getPassword() != null && !point.getPassword().isBlank()) {
            dto.setPassword(encryptDecryptConverter.decrypt(point.getPassword()));
        }
    }

    @AfterMapping
    protected void encryptField(PointDTO dto, @MappingTarget Point point) {
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            point.setEmail(encryptDecryptConverter.convert(dto.getEmail()));
        }
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            point.setPassword(encryptDecryptConverter.convert(dto.getPassword()));
        }
    }
}
