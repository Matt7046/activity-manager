package com.activityService;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class WebSocketService implements WebSocketHandler {


    private final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        // Aggiunge la sessione quando si connette un client
        String emailID = extractEmailFromSession(session);
        session.getAttributes().put("id", emailID);
        sessions.add(session);
        System.out.println("messageemailTest" + emailID);
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
        System.out.println("messageemail1" + " " + query);
        return query.split("=")[1];
    }


    public void sendNotification(String emailReceive, String message) {
        System.out.println("messageemail2: " + emailReceive);

        Flux.fromIterable(sessions)
                .filter(session -> session.isOpen()
                        && emailReceive.equals(session.getAttributes().get("id")))
                .flatMap(session -> {
                    System.out.println("Invio notifica a sessione con email: " + session.getAttributes().get("id"));
                    return session.send(Mono.just(session.textMessage(message)));
                })
                .subscribe();
    }
}


