package com.notificationService.processor;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.notification.Notification;
import com.common.dto.notification.NotificationDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.mapper.NotificationMapper;
import com.common.security.ResourceAccessClient;
import com.common.structure.exception.DecryptException;
import com.common.structure.exception.ForbiddenException;
import com.common.structure.messages.ForbiddenMessages;
import com.common.structure.status.ActivityHttpStatus;
import com.notificationService.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Flux;
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
    EncryptDecryptConverter encryptDecryptConverter;
    @Autowired
    private ResourceAccessClient resourceAccessClient;
    @Autowired
    private ForbiddenMessages forbiddenMessages;

    public Mono<ResponseDTO> getLatestNotifications(String identificativo, Integer page, Integer size, String status) {
        String identificativoForAccess = identificativoForAccessCheck(identificativo);
        return resourceAccessClient.assertCanAccess(identificativoForAccess)
                .then(Mono.fromCallable(() -> {
                    String statusDecrypt = encryptDecryptConverter.decrypt(status);
                    List<Notification> notificationList = notificationService.getLatestNotifications(identificativo, page,
                            size,
                            statusDecrypt);
                    List<NotificationDTO> notificationDTO = notificationList.stream().map(
                            notificationMapper::toDTO).toList();
                    return new ResponseDTO(notificationDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
                }));
    }

    /**
     * {@code assertCanAccess} confronta il JWT con l'email risorsa in chiaro. L'{@code identificativo} in path
     * coincide di solito con {@code userReceiver} in Mongo (cifrato); per il controllo si tenta la decifratura.
     * La query alle notifiche usa sempre il valore path/originale così com'è persistito.
     */
    private String identificativoForAccessCheck(String identificativo) {
        if (identificativo == null || identificativo.isBlank()) {
            return identificativo;
        }
        try {
            return encryptDecryptConverter.decrypt(identificativo);
        } catch (DecryptException e) {
            return identificativo;
        }
    }

    public Mono<ResponseDTO> saveNotificationList(List<NotificationDTO> notificationDTO) {
        if (notificationDTO == null || notificationDTO.isEmpty()) {
            return Mono.just(new ResponseDTO(new ArrayList<>(), ActivityHttpStatus.OK.value(), new ArrayList<>()));
        }
        return Flux.fromIterable(notificationDTO)
                .concatMap(dto -> {
                    String receiver = dto.getUserReceiver();
                    if (receiver == null || receiver.isBlank()) {
                        return Mono.error(new ForbiddenException(forbiddenMessages.notificationNoReceiver()));
                    }
                    return resourceAccessClient.assertCanAccess(identificativoForAccessCheck(receiver)).thenReturn(dto);
                })
                .collectList()
                .flatMap(authorized -> Mono.fromCallable(() -> {
                    List<Notification> notification = authorized.stream()
                            .map(notificationMapper::fromDTO)
                            .collect(Collectors.toList());
                    List<Notification> notificationList = notificationService.saveNotificationList(notification);
                    List<NotificationDTO> subDTO = notificationList.stream().map(
                            notificationMapper::toDTO).toList();
                    return new ResponseDTO(subDTO, ActivityHttpStatus.OK.value(), new ArrayList<>());
                }));
    }
}
