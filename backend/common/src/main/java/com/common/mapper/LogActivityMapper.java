package com.common.mapper;

import org.mapstruct.factory.Mappers;

import com.common.data.activity.LogActivity;
import com.common.dto.activity.ActivityDTO;
import com.common.dto.activity.LogActivityDTO;

import org.mapstruct.*;

@Mapper
public interface LogActivityMapper {

    LogActivityMapper INSTANCE = Mappers.getMapper(LogActivityMapper.class);

    // Mappatura di base ignorando il campo _id
    @Mapping(target = "_id", ignore = true) // Ignora il campo _id
    @Mapping(target = "logAttivita", ignore = true) // Inizialmente ignoriamo attivitaSvolte
    ActivityDTO toCastDTO(LogActivity logAttivita);

      // Da Entity a DTO
    LogActivityDTO toDTO(LogActivity logAttivita);
    

    // Da DTO a Entity
    LogActivity fromDTO(LogActivityDTO logAttivitaDto);

    // Metodo per trasformare "attivitaSvolte" e popolare il DTO
    @AfterMapping
    default void setLogAttivitaByLogAttivita(@MappingTarget ActivityDTO dto, LogActivity entity) {
        if (entity.getLog() != null) {           
            dto.setLogAttivita(entity.getLog());
        }
    }
}
