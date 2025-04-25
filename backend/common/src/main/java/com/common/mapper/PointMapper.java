package com.common.mapper;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.user.UserPoint;
import com.common.dto.auth.Point;
import com.common.dto.user.PointDTO;
import com.common.dto.user.UserPointDTO;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.stream.Collectors;


@Mapper(componentModel = "spring")
public abstract class PointMapper {
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    // Da Entity a DTO
    public abstract PointDTO toDTO(Point points);


    // Da DTO a Entity
    public abstract Point fromDTO(PointDTO userPointDto);


    @AfterMapping
    protected void decryptField(Point point, @MappingTarget PointDTO dto) {
        if (dto.getEmail() != null) {
            dto.setEmail(encryptDecryptConverter.decrypt(point.getEmail()));
        }
        if (dto.getPassword() != null) {
            dto.setPassword(encryptDecryptConverter.decrypt(point.getPassword()));
        }
    }

    @AfterMapping
    protected void decryptField(PointDTO dto, @MappingTarget Point point) {
        if (point.getEmail() != null) {
            point.setEmail(encryptDecryptConverter.convert(dto.getEmail()));
        }
        if (point.getPassword() != null) {
            point.setPassword(encryptDecryptConverter.convert(dto.getPassword()));
        }
    }
}





