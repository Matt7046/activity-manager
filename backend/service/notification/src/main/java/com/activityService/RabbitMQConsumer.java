package com.activityService;

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
    public void receiveNotification(String message, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) {
        System.out.println("Ricevuta notifica: " + message);

        // Simula un ritardo prima dell'ACK per vedere il messaggio su RabbitMQ Management UI
        try {
           // Thread.sleep(20000); // 5 secondi
            receive(message, 0);
          //  channel.basicAck(tag, false); // Conferma il messaggio SOLO dopo l'elaborazion
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    public void receive(String in, int receiver) throws InterruptedException {
        StopWatch watch = new StopWatch();
        watch.start();
        System.out.println("instance " + receiver + " [x] Received '" + in + "'");
        doWork(in);
        watch.stop();
        System.out.println("instance " + receiver + " [x] Done in "
                + watch.getTotalTimeSeconds() + "s");
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
