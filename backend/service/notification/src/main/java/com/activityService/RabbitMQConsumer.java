package com.activityService;

import com.common.dto.NotificationDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.io.IOException;

@Component
public class RabbitMQConsumer {

    @Autowired
    WebSocketService webSocketService;


    @RabbitListener(queues = "notifications.queue", ackMode = "MANUAL")
    public void receiveNotification(String message, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws JsonProcessingException {

        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(message);
        // Estrai il campo 'pointsNew' come un JsonNode e convertilo direttamente in String
        String emailUserReceive = rootNode.path("emailUserReceive").asText();
        // Simula un ritardo prima dell'ACK per vedere il messaggio su RabbitMQ Management UI
        try {
            // Thread.sleep(20000); // 5 secondi
            receive(emailUserReceive, message, 0);
            //  channel.basicAck(tag, false); // Conferma il messaggio SOLO dopo l'elaborazion
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public void receive(String emailReceive, String in, int receiver) throws InterruptedException {
        StopWatch watch = new StopWatch();
        watch.start();
        doWork(in);
        watch.stop();
        webSocketService.sendNotification(emailReceive, in);
    }

    private void doWork(String in) throws InterruptedException {
        for (char ch : in.toCharArray()) {
            if (ch == '.') {
                Thread.sleep(1000);
            }
        }
    }
}
