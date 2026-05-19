package com.notificationService.rabbitmq;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.notificationService.service.WebSocketService;
import com.rabbitmq.client.Channel;
import java.io.IOException;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQNotificationConsumer {

    @Autowired
    WebSocketService webSocketService;


    @RabbitListener(queues = "notifications.queue", ackMode = "MANUAL")
    public void receiveNotification(String jsonMessage, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) {
        try {
            webSocketService.persistAndBroadcastWs(jsonMessage);
            channel.basicAck(tag, false);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
