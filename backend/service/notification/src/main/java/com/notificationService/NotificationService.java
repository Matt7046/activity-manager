package com.notificationService;

import com.common.data.Notification;
import com.common.dto.NotificationDTO;
import com.common.dto.ResponseDTO;
import com.common.mapper.NotificationMapper;
import com.repository.notification.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repository;

    public Mono<ResponseDTO> saveNotification(Notification notification) {
        notification = repository.save(notification);
        NotificationDTO dto = NotificationMapper.INSTANCE.toDTO(notification);
        ResponseDTO response = new ResponseDTO(dto, HttpStatus.OK.value(),
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
