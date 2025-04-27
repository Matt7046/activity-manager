package com.common.mapper;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.activity.Activity;
import com.common.data.user.UserPoint;
import com.common.dto.activity.ActivityDTO;
import com.common.dto.activity.LogActivityDTO;
import com.common.dto.user.UserPointDTO;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.stream.Collectors;


@Mapper(componentModel = "spring")
public abstract class LogActivityToUserPointMapper {

    // Da Entity a DTO
   public abstract UserPointDTO toChange(LogActivityDTO logActivity);
}



