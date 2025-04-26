package com.notificationService.controller;

import com.common.dto.notification.NotificationDTO;
import com.notificationService.processor.EmailProcessor;
import com.common.dto.structure.ResponseDTO;
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

    @GetMapping("all/{identificativo}/{page}/{size}")
    public Mono<ResponseDTO> getNotificationsByIdentificativo(@PathVariable String identificativo, @PathVariable Integer page, @PathVariable Integer size) throws Exception {
        return  notificationProcessor.getLatestNotifications(identificativo,page,size );
    }

    @PostMapping("/entity")
    public Mono<ResponseDTO> saveNotifications(@RequestBody List<NotificationDTO> notificationDTOList) {
        return notificationProcessor.saveNotificationList(notificationDTOList);
    }
}
