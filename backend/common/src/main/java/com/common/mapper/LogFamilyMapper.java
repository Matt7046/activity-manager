package com.common.mapper;

import com.common.data.LogFamily;
import com.common.data.Notification;
import com.common.dto.LogFamilyDTO;
import com.common.dto.NotificationDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;


@Mapper
public interface LogFamilyMapper {
    LogFamilyMapper INSTANCE = Mappers.getMapper(LogFamilyMapper.class);

    // Da Entity a DTO
    LogFamilyDTO toDTO(LogFamily logFamily);
    

    // Da DTO a Entity
    LogFamily fromDTO(LogFamilyDTO logFamilyDTO);
}



