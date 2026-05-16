package com.common.mapper;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.family.LogFamily;
import com.common.dto.family.LogFamilyDTO;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class LogFamilyMapper {
    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;
    // Da Entity a DTO
    public abstract LogFamilyDTO toDTO(LogFamily logFamily);
    

    // Da DTO a Entity
    public abstract LogFamily fromDTO(LogFamilyDTO logFamilyDTO);

    @AfterMapping
    void decryptEmail(@MappingTarget LogFamilyDTO dto, LogFamily entity) {

        if (entity.getReceivedByEmail() != null) {
            dto.setReceivedByEmail(encryptDecryptConverter.decrypt(entity.getReceivedByEmail()));
        }
        if (entity.getPerformedByEmail() != null) {
            dto.setPerformedByEmail(encryptDecryptConverter.decrypt(entity.getPerformedByEmail()));
        }
    }

    @AfterMapping
    void encryptEmail(@MappingTarget LogFamily entity, LogFamilyDTO dto) {
        if (dto.getPerformedByEmail() != null && !dto.getPerformedByEmail().isBlank()) {
            entity.setPerformedByEmail(encryptDecryptConverter.convert(dto.getPerformedByEmail()));
        }
        if (dto.getReceivedByEmail() != null && !dto.getReceivedByEmail().isBlank()) {
            entity.setReceivedByEmail(encryptDecryptConverter.convert(dto.getReceivedByEmail()));
        }
    }
}



