package com.common.configurations;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;

@Service
public class RabbitMQProducer {



    @Autowired
    private RabbitTemplate template;

    @Autowired
    private FanoutExchange fanout;

    AtomicInteger dots = new AtomicInteger(0);

    AtomicInteger count = new AtomicInteger(0);

    @Scheduled(fixedDelay = 1000, initialDelay = 500)
    public void sendMessage(String message) {
        StringBuilder builder = new StringBuilder(message);
        if (dots.getAndIncrement() == 3) {
            dots.set(1);
        }
        for (int i = 0; i < dots.get(); i++) {
            builder.append('.');
        }
        builder.append(count.incrementAndGet());
        template.convertAndSend("notification.exchange", "notification.family", message);
        System.out.println(" [x] Sent '" + message + "'");
    }

}