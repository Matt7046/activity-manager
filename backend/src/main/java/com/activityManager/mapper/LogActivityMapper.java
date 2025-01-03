package com.activityManager.mapper;

import org.mapstruct.factory.Mappers;

import com.activityManager.data.LogActivity;
import com.activityManager.dto.ActivityDTO;
import com.activityManager.dto.LogActivityDTO;

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
