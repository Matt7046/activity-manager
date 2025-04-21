package com.notificationService.controller;

import com.common.data.notification.Notification;
import com.common.dto.notification.NotificationDTO;
import com.notificationService.service.NotificationService;
import org.springframework.web.bind.annotation.*;
import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.dto.structure.ResponseDTO;
import com.common.structure.status.ActivityHttpStatus;

import reactor.core.publisher.Mono;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "https://webapp-tn6q.onrender.com")
@RequestMapping("api/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    @GetMapping("all/{identificativo}/{page}/{size}")
    public Mono<ResponseDTO> getNotificationsByIdentificativo(@PathVariable String identificativo, @PathVariable Integer page, @PathVariable Integer size) throws Exception {
        identificativo = encryptDecryptConverter.decrypt(identificativo);
        List<Notification> notificationList = notificationService.getLatestNotifications(identificativo,page,size );
        ResponseDTO response = new ResponseDTO(notificationList, ActivityHttpStatus.OK.value(),
                new ArrayList<>());
        return Mono.just(response);

    }


    @PostMapping("/entity")
    public Mono<ResponseDTO> saveNotifications(@RequestBody List<NotificationDTO> notificationDTOList) {
        return notificationService.saveNotificationList(notificationDTOList)  // Ottieni il Mono<String>
                .map(result -> new ResponseDTO(result, ActivityHttpStatus.OK.value(), new ArrayList<>()));  // Mappa il risultato in un ResponseDTO
    }

}
