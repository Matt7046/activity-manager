package com.notificationService.processor;

import com.common.data.notification.Notification;
import com.common.dto.notification.NotificationDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.mapper.NotificationMapper;
import com.common.mapper.UserPointMapper;
import com.common.structure.status.ActivityHttpStatus;
import com.notificationService.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class NotificationProcessor {

    @Autowired
    private NotificationService notificationService;
    @Autowired
    private NotificationMapper notificationMapper;
    @Autowired
    private UserPointMapper userPointMapper;

    public Mono<ResponseDTO> getLatestNotifications(String identificativo, Integer page, Integer size) {
        return Mono.fromCallable(() -> {
            List<Notification> notificationList = notificationService.getLatestNotifications(identificativo, page, size);
            List<NotificationDTO> notificationDTO = notificationList.stream().map(
                    notificationMapper::toDTO).toList();
            return new ResponseDTO(notificationDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }

    public Mono<ResponseDTO> saveNotificationList(List<NotificationDTO> notificationDTO) {
        return Mono.fromCallable(() -> {
            List<Notification> notification = notificationDTO.stream()
                    .map(notificationMapper::fromDTO)
                    .collect(Collectors.toList());
            List<Notification> notificationList = notificationService.saveNotificationList(notification);
            List<NotificationDTO> subDTO = notificationList.stream().map(
                    notificationMapper::toDTO).toList();
            return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
        });
    }
}
