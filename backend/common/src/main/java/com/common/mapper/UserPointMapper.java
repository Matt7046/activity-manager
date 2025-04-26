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
    protected void decryptField(UserPoint point, @MappingTarget UserPointDTO dto) {
        if (dto.getEmail() != null) {
            dto.setEmail(encryptDecryptConverter.decrypt(point.getEmail()));
        }
        if (dto.getEmailUserCurrent() != null) {
            dto.setEmailUserCurrent(encryptDecryptConverter.decrypt(point.getEmailUserCurrent()));
        }
        if (dto.getPassword() != null) {
            dto.setPassword(encryptDecryptConverter.decrypt(point.getPassword()));
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
    protected void encryptField(UserPointDTO dto, @MappingTarget UserPoint point) {
            if (point.getEmail() != null) {
                point.setEmail(encryptDecryptConverter.convert(dto.getEmail()));
            }
            if (point.getEmailUserCurrent() != null) {
                point.setEmailUserCurrent(encryptDecryptConverter.convert(dto.getEmailUserCurrent()));
            }
            if (point.getPassword() != null) {
                point.setPassword(encryptDecryptConverter.convert(dto.getPassword()));
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



