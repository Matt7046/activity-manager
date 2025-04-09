package com.pointService.rabbitmq;

import com.common.dto.PointsDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pointService.PointService;
import com.rabbitmq.client.Channel;
import com.repository.point.PointRepository;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import java.io.IOException;

@Component
public class RabbitMQRollbackLogActivityConsumer {

    @Autowired
    private PointService pointService;

    @RabbitListener(queues = "notifications.log.point.queue", ackMode = "MANUAL")
    public void receiveNotification(String jsonMessage, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) throws JsonProcessingException {

             // Simula un ritardo prima dell'ACK per vedere il messaggio su RabbitMQ Management UI
        try {
            // Thread.sleep(20000); // 5 secondi
            receive(jsonMessage, 0);

            channel.basicAck(tag, false); // Conferma il messaggio SOLO dopo l'elaborazion
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public void receive(String in, int receiver) throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();

        PointsDTO pointsDTO = objectMapper.readValue(in, PointsDTO.class);
        StopWatch watch = new StopWatch();
        watch.start();
        doWork(in);
        pointService.rollbackSavePoint(pointsDTO);
        watch.stop();

    }

    private void doWork(String in) throws InterruptedException {
        for (char ch : in.toCharArray()) {
            if (ch == '.') {
                Thread.sleep(1000);
            }
        }
    }
}
