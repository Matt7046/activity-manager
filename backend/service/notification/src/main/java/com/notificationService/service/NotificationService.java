package com.notificationService.service;

import com.common.data.Notification;
import com.common.dto.NotificationDTO;
import com.common.dto.ResponseDTO;
import com.common.exception.ActivityHttpStatus;
import com.common.mapper.NotificationMapper;
import com.repository.notification.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repository;

    public Mono<ResponseDTO> saveNotification(NotificationDTO notification) {
        Notification entity = NotificationMapper.INSTANCE.fromDTO(notification);
        entity = repository.save(entity);
        NotificationDTO dto = NotificationMapper.INSTANCE.toDTO(entity);
        ResponseDTO response = new ResponseDTO(dto, ActivityHttpStatus.OK.value(),
                new ArrayList<>());
        return Mono.just(response);

    }

    public Mono<ResponseDTO> saveNotificationList(List<NotificationDTO> notification) {
        List<Notification> entity = NotificationMapper.INSTANCE.fromDTO(notification);
        entity = repository.saveAll(entity);
        List<NotificationDTO> dtoList = NotificationMapper.INSTANCE.toDTO(entity);
        ResponseDTO response = new ResponseDTO(dtoList, ActivityHttpStatus.OK.value(),
                new ArrayList<>());
        return Mono.just(response);

    }


    // Metodo per ottenere le ultime notifiche con paginazione
    public List<Notification> getLatestNotifications(String identificative, Integer page, Integer size) {
        // Crea un Pageable con la pagina desiderata e la dimensione della pagina
        PageRequest pageRequest = PageRequest.of(page, size); // page: indice della pagina (0-based), size: numero di risultati per pagina
        // Ottieni la pagina di notifiche
        return repository.findLatestNotifications(identificative, pageRequest);
    }
}
