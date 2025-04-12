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
import org.springframework.util.StopWatch;
@Component
public class RabbitMQNotificationConsumer {

    @Autowired
    WebSocketService webSocketService;


    @RabbitListener(queues = "notifications.queue", ackMode = "MANUAL")
    public void receiveNotification(String jsonMessage, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws JsonProcessingException {

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
        StopWatch watch = new StopWatch();
        watch.start();
        doWork(in);
        watch.stop();
        webSocketService.sendNotification(in);
    }

    private void doWork(String in) throws InterruptedException {
        for (char ch : in.toCharArray()) {
            if (ch == '.') {
                Thread.sleep(1000);
            }
        }
    }
}
