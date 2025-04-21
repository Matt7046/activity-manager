package com.common.mapper;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import org.mapstruct.factory.Mappers;

import com.common.data.activity.LogActivity;
import com.common.dto.activity.ActivityDTO;
import com.common.dto.activity.LogActivityDTO;

import org.mapstruct.*;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class LogActivityMapper {

    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    // Mappatura di base ignorando il campo _id
    @Mapping(target = "_id", ignore = true) // Ignora il campo _id
    @Mapping(target = "logAttivita", ignore = true) // Inizialmente ignoriamo attivitaSvolte
    abstract ActivityDTO toCastDTO(LogActivity logAttivita);

      // Da Entity a DTO
    public abstract LogActivityDTO toDTO(LogActivity logAttivita);
    

    // Da DTO a Entity
    public abstract LogActivity fromDTO(LogActivityDTO logAttivitaDto);

    // Metodo per trasformare "attivitaSvolte" e popolare il DTO
    @AfterMapping
    void decryptEmail(@MappingTarget LogActivityDTO dto, LogActivity entity) {
        if (entity.getEmail() != null) {
            dto.setEmail(encryptDecryptConverter.decrypt(entity.getEmail()));
        }
    }

    @AfterMapping
    void encryptEmail(@MappingTarget LogActivity entity, LogActivityDTO dto) {
        if (entity.getEmail() != null) {
            entity.setEmail(encryptDecryptConverter.convert(entity.getEmail()));
        }
    }

}
