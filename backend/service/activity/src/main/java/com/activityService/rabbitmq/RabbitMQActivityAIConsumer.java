package com.activityService.rabbitmq;

import com.activityService.service.ActivityWebAIService;
import com.common.configurations.rabbitmq.SearchPublisher;
import com.common.data.activity.event.ActivityCreateEvent;
import com.common.data.activity.event.ActivityEnrichedEvent;
import com.common.dto.activity.LogActivityDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.io.IOException;

@Component
public class RabbitMQActivityAIConsumer {

    private final SearchPublisher searchPublisher;
    @Autowired
    private ActivityWebAIService activityWebAIService;

    public RabbitMQActivityAIConsumer(SearchPublisher searchPublisher) {
        this.searchPublisher = searchPublisher;
    }

    @RabbitListener(queues = "search.ai.queue")
    public void handleCreate(String jsonMessage, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws JsonProcessingException {

        // Simula un ritardo prima dell'ACK per vedere il messaggio su RabbitMQ Management UI
        try {
            // Thread.sleep(20000); // 5 secondi
            receive(jsonMessage, 0);
            channel.basicAck(tag, false); // Conferma il messaggio SOLO dopo l'elaborazion
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void receive(String in, int receiver) throws InterruptedException, JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        ActivityCreateEvent event = objectMapper.readValue(in, ActivityCreateEvent.class);

        StopWatch watch = new StopWatch();
        watch.start();
        doWork(in);
        watch.stop();

        categorize(event).doOnSuccess(response1 -> {
                    // Invia l'evento dopo il salvataggio del log in modo asincrono
                    Mono.fromRunnable(() -> {
                        ActivityEnrichedEvent eventEnriched = new ActivityEnrichedEvent(
                                event._id(),
                                event.subTesto(),
                                event.nome(),
                                event.points(),
                                event.email(),
                                response1);
                        searchPublisher.publishEnriched(eventEnriched); // u
                    }).subscribe(); // Avvia il runnable senza bloccare il flusso

            }).doOnError(error -> {
            // Invia l'evento dopo il salvataggio del log in modo asincrono
            Mono.fromRunnable(() -> {
                System.out.println("Errore durante il salvataggio dei punti: " + error.getMessage());
                ActivityEnrichedEvent eventEnriched = new ActivityEnrichedEvent(
                        event._id(),
                        event.subTesto(),
                        event.nome(),
                        event.points(),
                        event.email(),
                        "GENERICO");
                searchPublisher.publishEnriched(eventEnriched); // u


            }).subscribe();
            }).subscribe();
    }

    private void doWork(String in) throws InterruptedException {
        for (char ch : in.toCharArray()) {
            if (ch == '.') {
                Thread.sleep(1000);
            }
        }
    }


    private Mono<String> categorize(ActivityCreateEvent event) {
        return activityWebAIService.categorize(event);
    }
}