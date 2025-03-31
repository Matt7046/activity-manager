package com.activityService;

import org.springframework.web.reactive.socket.WebSocketHandler;
import org.springframework.web.reactive.socket.WebSocketSession;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.concurrent.CopyOnWriteArrayList;

public class NotificationWebSocketHandler implements WebSocketHandler {

    private final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    @Override
    public Mono<Void> handle(WebSocketSession session) {
        sessions.add(session);
        
        // Gestisce i messaggi ricevuti
        Flux<String> receive = session.receive()
                .map(msg -> msg.getPayloadAsText())
                .doOnNext(System.out::println); // Stampa il messaggio ricevuto
        
        // Mantiene la connessione aperta
        return receive.then(Mono.fromRunnable(() -> sessions.remove(session)));
    }

    public void sendNotification(String message) {
        Flux.fromIterable(sessions)
                .filter(WebSocketSession::isOpen)
                .flatMap(session -> session.send(Mono.just(session.textMessage(message))))
                .subscribe();
    }
}
