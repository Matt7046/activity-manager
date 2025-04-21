package com.common.mapper;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.activity.LogActivity;
import com.common.data.family.LogFamily;
import com.common.dto.activity.ActivityDTO;
import com.common.dto.family.LogFamilyDTO;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
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
    void decryptEmail(@MappingTarget LogFamily entity, LogFamilyDTO dto) {
        if (entity.getPerformedByEmail() != null) {
            entity.setPerformedByEmail(encryptDecryptConverter.convert(entity.getPerformedByEmail()));
        }
        if (entity.getReceivedByEmail() != null) {
            entity.setReceivedByEmail(encryptDecryptConverter.convert(entity.getReceivedByEmail()));
        }
    }
}



