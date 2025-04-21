package com.notificationService.service;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.notification.Notification;
import com.common.data.notification.StatusNotification;
import com.common.dto.notification.NotificationDTO;
import com.common.dto.structure.ResponseDTO;
import com.common.mapper.NotificationMapper;
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

    @Autowired
    EncryptDecryptConverter encryptDecryptConverter;

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        // Aggiunge la sessione quando si connette un client
        String emailID = extractEmailFromSession(session);
        session.getAttributes().put(identification, emailID);
        sessions.add(session);
        session.closeStatus().doOnTerminate(() -> {
            sessions.remove(session);
        }).subscribe(); // Im
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
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setUserReceiver(encryptDecryptConverter.convert(userReceiver));
        notification.setUserSender(encryptDecryptConverter.convert(userSender));
        notification.setDateSender(dateSender);
        notification.setStatus(StatusNotification.NOT_READ);
        Notification response = notificationService.saveNotification(notification);
        Flux.fromIterable(sessions).filter(
                        session -> session.isOpen() && userReceiver.equals(session.getAttributes().get(identification)))
                .flatMap(session -> {
                    saveNotificationStatusSend(session, response, objectMapper);
                    return session.send(Mono.just(session.textMessage(jsonMessage)));
                }).subscribe();
    }

    private Mono<WebSocketSession> saveNotificationStatusSend(WebSocketSession session, Notification notification, ObjectMapper objectMapper) {
        notification.setStatus(StatusNotification.SEND);
        notificationService.saveNotification(notification);
        return Mono.just(session);
    }
}


