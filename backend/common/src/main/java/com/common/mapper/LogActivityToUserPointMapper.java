package com.common.mapper;

import com.common.dto.activity.LogActivityDTO;
import com.common.dto.user.UserPointDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class LogActivityToUserPointMapper {

    // Da Entity a DTO
   public abstract UserPointDTO toChange(LogActivityDTO logActivity);
}



