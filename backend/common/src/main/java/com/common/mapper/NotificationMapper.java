package com.common.mapper;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.notification.Notification;
import com.common.dto.auth.Point;
import com.common.dto.notification.NotificationDTO;
import com.common.dto.user.PointDTO;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;


@Mapper(componentModel = "spring")
public abstract class NotificationMapper {

    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;
    // Da Entity a DTO
    public abstract NotificationDTO toDTO(Notification notification);

    // Da DTO a Entity
    public abstract Notification fromDTO(NotificationDTO ActivityDto);

    @AfterMapping
    protected void decryptEmail(Notification notification, @MappingTarget NotificationDTO dto) {
        if (dto.getUserReceiver() != null) {
            dto.setUserReceiver(encryptDecryptConverter.decrypt(notification.getUserReceiver()));
        }
        if (dto.getUserSender() != null) {
            dto.setUserSender(encryptDecryptConverter.decrypt(notification.getUserSender()));
        }
    }

    @AfterMapping
    protected void encryptEmail(NotificationDTO dto, @MappingTarget Notification notification) {
        if (notification.getUserReceiver() != null) {
            notification.setUserReceiver(encryptDecryptConverter.convert(dto.getUserReceiver()));
        }
        if (notification.getUserSender() != null) {
            notification.setUserSender(encryptDecryptConverter.convert(dto.getUserSender()));
        }
    }
}



