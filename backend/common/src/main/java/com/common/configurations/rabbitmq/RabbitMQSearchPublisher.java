package com.common.configurations.rabbitmq;

import com.common.data.activity.event.ActivityCreateEvent;
import com.common.data.activity.event.ActivityEnrichedEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQSearchPublisher implements SearchPublisher {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange.name.activity.search.exchangeName}")
    private String exchangeActivitySearch;

    @Value("${rabbitmq.routingKey.activity.search.create}")
    private String routingKeySearchCreate;

    @Value("${rabbitmq.routingKey.activity.search.enriched}")
    private String routingKeySearchEnriched;

    public RabbitMQSearchPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    // ========================
    // CREATE EVENT (→ AI)
    // ========================
    public void publishCreate(ActivityCreateEvent event) {
        try {
            String jsonMessage = new ObjectMapper().writeValueAsString(event);
            rabbitTemplate.convertAndSend(
                    exchangeActivitySearch,
                    routingKeySearchCreate,
                    jsonMessage
            );
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }


    }

    // ========================
    // ENRICHED EVENT (→ ELASTIC)
    // ========================
    public void publishEnriched(ActivityEnrichedEvent event) {
        try {
            String jsonMessage = new ObjectMapper().writeValueAsString(event);

            rabbitTemplate.convertAndSend(
                    exchangeActivitySearch,
                    routingKeySearchEnriched,
                    jsonMessage
            );
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}