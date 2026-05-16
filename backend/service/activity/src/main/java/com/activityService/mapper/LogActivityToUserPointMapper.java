package com.activityService.mapper;

import com.activityService.dto.LogActivityDTO;
import com.common.dto.user.UserPointDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public abstract class LogActivityToUserPointMapper {

    public abstract UserPointDTO toChange(LogActivityDTO logActivity);
}
