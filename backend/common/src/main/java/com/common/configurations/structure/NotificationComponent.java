package com.common.configurations.structure;

import com.common.configurations.rabbitmq.RabbitMQProducer;
import com.common.dto.structure.InterfaceDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class NotificationComponent {
    @Autowired
    private RabbitMQProducer notificationPublisher;

    public void inviaNotifica(InterfaceDTO dto, String exchange, String routingKey) {
        try {
            String jsonMessage = new ObjectMapper().writeValueAsString(dto);
            notificationPublisher.sendMessage(exchange, routingKey, jsonMessage);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }
    }
}
