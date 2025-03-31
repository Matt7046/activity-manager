package com.activityService;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class WebSocketService implements WebSocketHandler {

    private final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        // Aggiunge la sessione quando si connette un client
        sessions.add(session);
        System.out.println("Connessione WebSocket stabilita.");

        // Flux per ricevere messaggi dal client (opzionale, solo per logging)
        Flux<String> receive = session.receive()
                .map(msg -> msg.getPayloadAsText())
                .doOnNext(msg -> System.out.println("Messaggio ricevuto: " + msg));

        // Quando il client si disconnette, rimuoviamo la sessione
        return receive.then(Mono.fromRunnable(() -> {
            sessions.remove(session);
            System.out.println("Connessione WebSocket chiusa.");
        }));
    }

    public void sendNotification(String message) {
        // Invia la notifica a tutte le sessioni WebSocket attive
        Flux.fromIterable(sessions)
                .filter(WebSocketSession::isOpen)
                .flatMap(session -> session.send(Mono.just(session.textMessage(message))))
                .subscribe();
    }
}
