package com.notificationService;

import com.common.data.Notification;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.common.configurations.EncryptDecryptConverter;
import com.common.dto.ResponseDTO;
import reactor.core.publisher.Mono;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

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
        identificativo = encryptDecryptConverter.decrypts(identificativo);
        List<Notification> notificationList = notificationService.getLatestNotifications(identificativo,page,size );
        ResponseDTO response = new ResponseDTO(notificationList, HttpStatus.OK.value(),
                new ArrayList<>());
        return Mono.just(response);

    }
}
