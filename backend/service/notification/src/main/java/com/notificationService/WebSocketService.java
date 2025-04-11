package com.notificationService;

import com.common.data.StatusNotification;
import com.common.dto.NotificationDTO;
import com.common.dto.ResponseDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.Date;
import java.util.concurrent.CopyOnWriteArrayList;

import org.springframework.beans.factory.annotation.Value;

@Service
public class WebSocketService implements WebSocketHandler {


    private final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    @Value("${session.attribute.identification}")
    private String identification;

    @Autowired
    private NotificationService notificationService;

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        // Aggiunge la sessione quando si connette un client
        String emailID = extractEmailFromSession(session);
        session.getAttributes().put(identification, emailID);
        sessions.add(session);
        // Flux per ricevere messaggi dal client (opzionale, solo per logging)
        Flux<String> receive = session.receive().map(msg -> msg.getPayloadAsText());

        // Quando il client si disconnette, rimuoviamo la sessione
        return receive.then(Mono.fromRunnable(() -> {
            sessions.remove(session);
        }));
    }


    private String extractEmailFromSession(WebSocketSession session) {
        // Ottieni l'URL completo della sessione

        // Esegui il parsing per estrarre il parametro emailUserCurrent
        URI uri = session.getHandshakeInfo().getUri();
        String query = uri.getQuery();
        return query.split("=")[1];
    }


    public void sendNotification(String jsonMessage) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(jsonMessage);
        // Estrai il campo come un JsonNode e convertilo direttamente in String
        String userReceiver = rootNode.path("userReceiver").asText();
        String userSender = rootNode.path("userSender").asText();
        String message = rootNode.path("message").asText();
        // Ottenere la data come stringa
        long dateSenderLong = rootNode.path("dateSender").longValue();
        Date dateSender = new Date(dateSenderLong);
        NotificationDTO notification = new NotificationDTO();
        notification.setMessage(message);
        notification.setUserReceiver(userReceiver);
        notification.setUserSender(userSender);
        notification.setDateSender(dateSender);
        notification.setStatus(StatusNotification.NOT_READ);
        Mono<ResponseDTO> response = notificationService.saveNotification(notification);
        Flux.fromIterable(sessions).filter(session -> session.isOpen() && userReceiver.equals(session.getAttributes().get(identification)))
                .flatMap(session -> {
                    response.flatMap(responseDTO ->
                            saveNotificationStatusSend(session, responseDTO, objectMapper)
                    ).subscribe();
                    return session.send(Mono.just(session.textMessage(jsonMessage)));
                }).subscribe();
    }

    private Mono<WebSocketSession> saveNotificationStatusSend(WebSocketSession session, ResponseDTO responseDTO, ObjectMapper objectMapper) {
        try {
            NotificationDTO notificationDTO = objectMapper.readValue(
                    responseDTO.getJsonText().toString(),
                    NotificationDTO.class
            );
            notificationDTO.setStatus(StatusNotification.SEND);
            notificationService.saveNotification(notificationDTO);
            return Mono.just(session);
        } catch (JsonProcessingException e) {
            return Mono.error(e);
        }
    }
}


