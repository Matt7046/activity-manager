package com.notificationService.controller;

import com.common.dto.notification.NotificationDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.security.ReactiveJwt;
import com.notificationService.processor.NotificationProcessor;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;

@RestController
@CrossOrigin(origins = "https://webapp-tn6q.onrender.com")
@RequestMapping("api/notification")
public class NotificationController {

    @Autowired
    private NotificationProcessor notificationProcessor;
    @Autowired
    private ReactiveJwt reactiveJwt;

    @GetMapping("all/{identificativo}/{page}/{size}/{status}")
    public Mono<ResponseDTO> getNotificationsByIdentificativo(@PathVariable String identificativo,
            @PathVariable Integer page, @PathVariable Integer size, @PathVariable String status) {
        return reactiveJwt.currentSubject()
                .flatMap(ignored -> notificationProcessor.getLatestNotifications(identificativo, page, size, status));
    }

    @PostMapping("/entity")
    public Mono<ResponseDTO> saveNotifications(@RequestBody List<NotificationDTO> notificationDTOList) {
        return reactiveJwt.currentSubject()
                .flatMap(ignored -> notificationProcessor.saveNotificationList(notificationDTOList));
    }
}
