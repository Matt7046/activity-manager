package com.common.mapper;

import com.common.data.Activity;
import com.common.data.Notification;
import com.common.dto.ActivityDTO;
import com.common.dto.NotificationDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;


@Mapper
public interface NotificationMapper {
    NotificationMapper INSTANCE = Mappers.getMapper(NotificationMapper.class);

    // Da Entity a DTO
    NotificationDTO toDTO(Notification notification);
    

    // Da DTO a Entity
    Notification fromDTO(NotificationDTO ActivityDto);
}



