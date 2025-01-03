package com.activityManager.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import com.activityManager.data.Activity;
import com.activityManager.dto.ActivityDTO;

@Mapper
public interface ActivityMapper {
    ActivityMapper INSTANCE = Mappers.getMapper(ActivityMapper.class);

    // Da Entity a DTO
    ActivityDTO toDTO(Activity Activity);
    

    // Da DTO a Entity
    Activity fromDTO(ActivityDTO ActivityDto);
}



