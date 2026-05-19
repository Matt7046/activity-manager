package com.notificationService.service;

import com.common.configurations.encrypt.EncryptDecryptConverter;
import com.common.data.notification.Notification;
import com.common.data.notification.StatusNotification;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.notificationService.rabbitmq.NotificationWsBroadcast;
import com.notificationService.rabbitmq.NotificationWsBroadcaster;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketMessage;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
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

    @Autowired
    private NotificationWsBroadcaster notificationWsBroadcaster;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        // Aggiunge la sessione quando si connette un client
        String emailID = extractEmailFromSession(session);
        session.getAttributes().put(identification, emailID);
        sessions.add(session);
        session.closeStatus().doOnTerminate(() -> sessions.remove(session)).subscribe(); // Im
        // Flux per ricevere messaggi dal client (opzionale, solo per logging)
        Flux<String> receive = session.receive().map(WebSocketMessage::getPayloadAsText);

        // Quando il client si disconnette, rimuoviamo la sessione
        return receive.then(Mono.fromRunnable(() -> sessions.remove(session)));
    }


    private String extractEmailFromSession(WebSocketSession session) {
        URI uri = session.getHandshakeInfo().getUri();
        String query = uri.getQuery();
        if (query == null || query.isBlank()) {
            return "";
        }
        for (String param : query.split("&")) {
            String[] pair = param.split("=", 2);
            if (pair.length == 2 && "emailUserCurrent".equals(pair[0])) {
                return URLDecoder.decode(pair[1], StandardCharsets.UTF_8);
            }
        }
        return "";
    }


    /**
     * Consumato da una sola replica (coda {@code notifications.queue}): persiste su Mongo
     * e pubblica sul fanout per il push WebSocket su tutte le istanze.
     */
    public void persistAndBroadcastWs(String jsonMessage) throws JsonProcessingException {
        Notification saved = persistNotification(jsonMessage);
        notificationWsBroadcaster.broadcast(jsonMessage, saved.get_id());
    }

    /**
     * Consumato da ogni replica (coda anonima sul fanout): inoltra solo alle sessioni WS locali.
     */
    public void pushToLocalWebSockets(String broadcastJson) throws JsonProcessingException {
        NotificationWsBroadcast broadcast = objectMapper.readValue(broadcastJson, NotificationWsBroadcast.class);
        String jsonMessage = broadcast.getPayload();
        String notificationId = broadcast.getNotificationId();

        JsonNode rootNode = objectMapper.readTree(jsonMessage);
        String userReceiver = rootNode.path("userReceiver").asText();

        Flux.fromIterable(sessions)
                .filter(session -> session.isOpen()
                        && userReceiver.equals(session.getAttributes().get(identification)))
                .flatMap(session -> {
                    markNotificationReceived(notificationId);
                    return session.send(Mono.just(session.textMessage(jsonMessage)));
                })
                .subscribe();
    }

    private Notification persistNotification(String jsonMessage) throws JsonProcessingException {
        JsonNode rootNode = objectMapper.readTree(jsonMessage);
        String userReceiver = rootNode.path("userReceiver").asText();
        String userSender = rootNode.path("userSender").asText();
        String message = rootNode.path("message").asText();
        long dateSenderLong = rootNode.path("dateSender").longValue();
        Date dateSender = new Date(dateSenderLong);

        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setUserReceiver(encryptDecryptConverter.convert(userReceiver));
        notification.setUserSender(encryptDecryptConverter.convert(userSender));
        notification.setDateSender(dateSender);
        notification.setStatus(StatusNotification.NOT_READ);
        return notificationService.saveNotification(notification);
    }

    private void markNotificationReceived(String notificationId) {
        notificationService.findById(notificationId).ifPresent(notification -> {
            notification.setStatus(StatusNotification.RECEIVE);
            notificationService.saveNotification(notification);
        });
    }
}


