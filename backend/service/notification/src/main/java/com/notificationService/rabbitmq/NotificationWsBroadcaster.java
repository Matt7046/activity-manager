package com.notificationService.rabbitmq;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class NotificationWsBroadcaster {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Value("${rabbitmq.exchange.name.notification-ws}")
    private String fanoutExchangeName;

    public void broadcast(String originalJson, String notificationId) throws JsonProcessingException {
        NotificationWsBroadcast message = new NotificationWsBroadcast(notificationId, originalJson);
        rabbitTemplate.convertAndSend(fanoutExchangeName, "", objectMapper.writeValueAsString(message));
    }
}
