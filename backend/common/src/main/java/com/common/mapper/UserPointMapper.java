package com.common.mapper;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.dto.user.UserPointDTO;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import com.common.data.user.UserPoint;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = { PointMapper.class })
public abstract class UserPointMapper {
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    // Da Entity a DTO
    public abstract UserPointDTO toDTO(UserPoint points) throws Exception;


    // Da DTO a Entity
    public abstract UserPoint fromDTO(UserPointDTO userPointDto) throws Exception;


    @AfterMapping
    protected void decryptEmail(UserPoint point, @MappingTarget UserPointDTO dto) {
        if (dto.getEmail() != null) {
            dto.setEmail(encryptDecryptConverter.decrypt(point.getEmail()));
        }
        if (dto.getEmailFamily() != null) {
            dto.setEmailFamily(encryptDecryptConverter.decrypt(point.getEmailFamily()));
        }
        if (dto.getEmailFigli() != null) {
            dto.setEmailFigli(
                    point.getEmailFigli().stream()
                            .map(encryptDecryptConverter::decrypt)
                            .collect(Collectors.toList())
            );
        }
    }

    @AfterMapping
    protected void encryptEmail(UserPointDTO dto, @MappingTarget UserPoint point) {
        if (point.getEmail() != null) {
            point.setEmail(encryptDecryptConverter.convert(dto.getEmail()));
        }
        if (point.getEmailFamily() != null) {
            point.setEmailFamily(encryptDecryptConverter.convert(dto.getEmailFamily()));
        }
        if (point.getEmailFigli() != null) {
            point.setEmailFigli(
                    point.getEmailFigli().stream()
                            .map(encryptDecryptConverter::convert)
                            .collect(Collectors.toList())
            );
        }
    }
}



