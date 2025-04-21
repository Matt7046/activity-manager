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
    public abstract UserPointDTO toDTO(UserPoint points) throws Exception;


    // Da DTO a Entity
    public abstract UserPoint fromDTO(UserPointDTO userPointDto) throws Exception;


    @AfterMapping
    protected void decryptEmail(Point point, @MappingTarget PointDTO dto) {
        if (dto.getEmail() != null) {
            dto.setEmail(encryptDecryptConverter.decrypt(point.getEmail()));
        }
    }

    @AfterMapping
    protected void encryptEmail(PointDTO dto, @MappingTarget Point point) {
        if (point.getEmail() != null) {
            point.setEmail(encryptDecryptConverter.convert(dto.getEmail()));
        }
    }
}





