package com.activityService;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.net.URI;
import java.util.concurrent.CopyOnWriteArrayList;
import org.springframework.beans.factory.annotation.Value;

@Service
public class WebSocketService implements WebSocketHandler {


    private final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    @Value("${session.attribute.identification}")
    private String identification;

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        // Aggiunge la sessione quando si connette un client
        String emailID = extractEmailFromSession(session);
        session.getAttributes().put(identification, emailID);
        sessions.add(session);
        // Flux per ricevere messaggi dal client (opzionale, solo per logging)
        Flux<String> receive = session.receive()
                .map(msg -> msg.getPayloadAsText());

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


    public void sendNotification(String emailReceive, String message) {

        Flux.fromIterable(sessions)
                .filter(session -> session.isOpen()
                        && emailReceive.equals(session.getAttributes().get(identification)))
                .flatMap(session -> {
                    return session.send(Mono.just(session.textMessage(message)));
                })
                .subscribe();
    }
}


