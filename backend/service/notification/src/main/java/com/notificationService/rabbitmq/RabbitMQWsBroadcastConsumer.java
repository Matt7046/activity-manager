package com.notificationService.rabbitmq;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.notificationService.service.WebSocketService;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQWsBroadcastConsumer {

    @Autowired
    private WebSocketService webSocketService;

    @RabbitListener(queues = "#{notificationWsInstanceQueue.name}")
    public void receiveWsBroadcast(String broadcastJson) throws JsonProcessingException {
        webSocketService.pushToLocalWebSockets(broadcastJson);
    }
}
