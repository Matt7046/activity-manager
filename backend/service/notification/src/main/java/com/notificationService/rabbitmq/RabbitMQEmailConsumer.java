package com.notificationService.rabbitmq;

import com.common.dto.user.UserPointWithChildDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.notificationService.processor.EmailProcessor;
import com.rabbitmq.client.Channel;
import java.io.IOException;
import java.time.Duration;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQEmailConsumer {

    private static final Duration EMAIL_TIMEOUT = Duration.ofMinutes(3);

    @Autowired
    private EmailProcessor emailProcessor;

    @RabbitListener(queues = "email.queue", ackMode = "MANUAL")
    public void receiveNotification(String jsonMessage, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            UserPointWithChildDTO userPointDTO = objectMapper.readValue(jsonMessage, UserPointWithChildDTO.class);
            if (userPointDTO.getUserPointChild() == null) {
                emailProcessor.sendPasswordEmail(userPointDTO).block(EMAIL_TIMEOUT);
            } else {
                emailProcessor.sendPasswordEmailChild(userPointDTO).block(EMAIL_TIMEOUT);
            }
            channel.basicAck(tag, false);
        } catch (Exception e) {
            nackSafely(channel, tag);
            throw new RuntimeException(e);
        }
    }

    private void nackSafely(Channel channel, long tag) {
        try {
            if (channel.isOpen()) {
                channel.basicNack(tag, false, false);
            }
        } catch (IOException ignored) {
            // canale già chiuso
        }
    }
}
