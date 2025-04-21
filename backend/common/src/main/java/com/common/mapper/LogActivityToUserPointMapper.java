package com.common.mapper;

import com.common.data.activity.Activity;
import com.common.dto.activity.ActivityDTO;
import com.common.dto.activity.LogActivityDTO;
import com.common.dto.user.UserPointDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;


@Mapper
public interface LogActivityToUserPointMapper {
    LogActivityToUserPointMapper INSTANCE = Mappers.getMapper(LogActivityToUserPointMapper.class);

    // Da Entity a DTO
    UserPointDTO toChange(LogActivityDTO Activity);


}



