package com.activityService.mapper;

import com.activityService.dto.ActivityDTO;
import com.activityService.dto.LogActivityDTO;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.activity.LogActivity;
import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class LogActivityMapper {

    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    @Mapping(target = "_id", ignore = true)
    @Mapping(target = "logAttivita", ignore = true)
    abstract ActivityDTO toCastDTO(LogActivity logAttivita);

    public abstract LogActivityDTO toDTO(LogActivity logAttivita);

    public abstract LogActivity fromDTO(LogActivityDTO logAttivitaDto);

    @AfterMapping
    void decryptEmail(@MappingTarget LogActivityDTO dto, LogActivity entity) {
        if (entity.getEmail() != null) {
            dto.setEmail(encryptDecryptConverter.decrypt(entity.getEmail()));
        }
    }

    @AfterMapping
    void encryptEmail(@MappingTarget LogActivity entity, LogActivityDTO dto) {
        if (dto.getEmail() != null && !dto.getEmail().isBlank()) {
            entity.setEmail(encryptDecryptConverter.convert(dto.getEmail()));
        }
    }
}
