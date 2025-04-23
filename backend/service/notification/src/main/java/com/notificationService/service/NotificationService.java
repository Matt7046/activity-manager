package com.notificationService.service;

import com.common.data.notification.Notification;
import com.common.mapper.NotificationMapper;
import com.notificationService.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repository;

    @Autowired
    private NotificationMapper notificationMapper;

    public Notification saveNotification(Notification notification) {
        notification = repository.save(notification);
        return notification;

    }

    public List<Notification> saveNotificationList(List<Notification> notification) {

        return repository.saveAll(notification);
    }


    // Metodo per ottenere le ultime notifiche con paginazione
    public List<Notification> getLatestNotifications(String identificative, Integer page, Integer size) {
        // Crea un Pageable con la pagina desiderata e la dimensione della pagina
        PageRequest pageRequest = PageRequest.of(page, size); // page: indice della pagina (0-based), size: numero di risultati per pagina
        // Ottieni la pagina di notifiche
        return repository.findLatestNotifications(identificative, pageRequest);
    }
}
