package com.common.mapper;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.dto.user.UserPointDTO;
import com.common.security.EmailNormalization;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import com.common.data.user.UserPoint;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = { PointMapper.class })
public abstract class UserPointMapper {
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;


    public abstract UserPointDTO toDTO(UserPoint points);

    public abstract UserPoint fromDTO(UserPointDTO userPointDto);

    public abstract List<UserPointDTO> toDTO(List<UserPoint> points);

    public abstract List<UserPoint> fromDTO(List<UserPointDTO> userPointDto);

    @AfterMapping
    protected void decryptField(UserPoint point, @MappingTarget UserPointDTO dto) {
        if (point.getEmail() != null && !point.getEmail().isBlank()) {
            dto.setEmail(encryptDecryptConverter.decrypt(point.getEmail()));
        }
        if (point.getEmailUserCurrent() != null && !point.getEmailUserCurrent().isBlank()) {
            dto.setEmailUserCurrent(encryptDecryptConverter.decrypt(point.getEmailUserCurrent()));
        }
        if (point.getEmailChild() != null && !point.getEmailChild().isBlank()) {
            dto.setEmailChild(encryptDecryptConverter.decrypt(point.getEmailChild()));
        }
        if (point.getPassword() != null && !point.getPassword().isBlank()) {
            dto.setPassword(encryptDecryptConverter.decrypt(point.getPassword()));
        }
        if (point.getEmailFigli() != null) {
            dto.setEmailFigli(
                    point.getEmailFigli().stream().map(encryptDecryptConverter::decrypt).collect(Collectors.toList()));
        }
    }

    @AfterMapping
    protected void encryptField(UserPointDTO dto, @MappingTarget UserPoint point) {
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            point.setEmail(encryptDecryptConverter.convert(EmailNormalization.normalize(dto.getEmail())));
        }
        if (dto.getEmailChild() != null && !dto.getEmailChild().isBlank()) {
            point.setEmailChild(encryptDecryptConverter.convert(EmailNormalization.normalize(dto.getEmailChild())));
        }
        if (dto.getEmailUserCurrent() != null && !dto.getEmailUserCurrent().isBlank()) {
            point.setEmailUserCurrent(
                    encryptDecryptConverter.convert(EmailNormalization.normalize(dto.getEmailUserCurrent())));
        }
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            point.setPassword(encryptDecryptConverter.convert(dto.getPassword()));
        }
        if (dto.getEmailFigli() != null) {
            point.setEmailFigli(
                    dto.getEmailFigli().stream()
                            .map(EmailNormalization::normalize)
                            .map(encryptDecryptConverter::convert)
                            .collect(Collectors.toList()));
        }
    }
}
