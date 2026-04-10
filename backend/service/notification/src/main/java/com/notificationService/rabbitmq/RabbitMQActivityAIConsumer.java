package com.notificationService.rabbitmq;

import com.common.configurations.rabbitmq.SearchPublisher;
import com.common.data.activity.event.ActivityCreateEvent;
import com.common.data.activity.event.ActivityEnrichedEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.rabbitmq.client.Channel;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.io.IOException;

@Component
public class RabbitMQActivityAIConsumer {

    private final SearchPublisher searchPublisher;

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
        ActivityEnrichedEvent enriched = new ActivityEnrichedEvent(
                event._id(),
                event.subTesto(),
                event.nome(),
                event.points(),
                event.email(),
                categorize(event)
        );

        // 👉 Pubblica verso Elastic step
        searchPublisher.publishEnriched(enriched);
    }

    private void doWork(String in) throws InterruptedException {
        for (char ch : in.toCharArray()) {
            if (ch == '.') {
                Thread.sleep(1000);
            }
        }
    }


    private String categorize(ActivityCreateEvent event) {
        // MOCK iniziale
        if (event.nome().toLowerCase().contains("sport")) return "SPORT";
        if (event.nome().toLowerCase().contains("studio")) return "STUDY";
        return "GENERIC";
    }
}