package com.common.configurations.rabbitmq;

import com.common.data.activity.event.ActivityCreateEvent;
import com.common.data.activity.event.ActivityEnrichedEvent;
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
            rabbitTemplate.convertAndSend(
                    exchangeActivitySearch,
                    routingKeySearchCreate,
                    event
            );
        }

        // ========================
        // ENRICHED EVENT (→ ELASTIC)
        // ========================
        public void publishEnriched(ActivityEnrichedEvent event) {
            rabbitTemplate.convertAndSend(
                    exchangeActivitySearch,
                    routingKeySearchEnriched,
                    event
            );
        }
    }