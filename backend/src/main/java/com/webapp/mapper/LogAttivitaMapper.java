package com.webapp.mapper;

import org.mapstruct.factory.Mappers;
import com.webapp.data.LogAttivita;
import com.webapp.dto.LogAttivitaDTO;
import com.webapp.dto.ActivityDTO;

import org.mapstruct.*;

@Mapper
public interface LogAttivitaMapper {

    LogAttivitaMapper INSTANCE = Mappers.getMapper(LogAttivitaMapper.class);

    // Mappatura di base ignorando il campo _id
    @Mapping(target = "_id", ignore = true) // Ignora il campo _id
    @Mapping(target = "logAttivita", ignore = true) // Inizialmente ignoriamo attivitaSvolte
    ActivityDTO toCastDTO(LogAttivita logAttivita);

      // Da Entity a DTO
    LogAttivitaDTO toDTO(LogAttivita logAttivita);
    

    // Da DTO a Entity
    LogAttivita fromDTO(LogAttivitaDTO logAttivitaDto);

    // Metodo per trasformare "attivitaSvolte" e popolare il DTO
    @AfterMapping
    default void setLogAttivitaByLogAttivita(@MappingTarget ActivityDTO dto, LogAttivita entity) {
        if (entity.getLog() != null) {           
            dto.setLogAttivita(entity.getLog());
        }
    }
}
