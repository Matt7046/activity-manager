package com.common.mapper;

import com.common.data.notification.Notification;
import com.common.dto.notification.NotificationDTO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;


@Mapper
public interface NotificationMapper {
    NotificationMapper INSTANCE = Mappers.getMapper(NotificationMapper.class);

    // Da Entity a DTO
    NotificationDTO toDTO(Notification notification);

    List<NotificationDTO> toDTO(List<Notification> notification);

    // Da DTO a Entity
    Notification fromDTO(NotificationDTO ActivityDto);


    List<Notification> fromDTO(List<NotificationDTO> notification);

}



