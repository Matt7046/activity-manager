package com.webapp.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.webapp.data.Activity;
import com.webapp.dto.ActivityDTO;

@Mapper
public interface ActivityMapper {
    ActivityMapper INSTANCE = Mappers.getMapper(ActivityMapper.class);

    // Da Entity a DTO
    ActivityDTO toDTO(Activity Activity);
    

    // Da DTO a Entity
    Activity fromDTO(ActivityDTO ActivityDto);
}



