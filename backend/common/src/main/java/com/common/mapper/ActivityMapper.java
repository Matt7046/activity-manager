package com.common.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.common.data.activity.Activity;
import com.common.dto.activity.ActivityDTO;



@Mapper
public interface ActivityMapper {
    ActivityMapper INSTANCE = Mappers.getMapper(ActivityMapper.class);

    // Da Entity a DTO
    ActivityDTO toDTO(Activity Activity);
    

    // Da DTO a Entity
    Activity fromDTO(ActivityDTO ActivityDto);
}



