package com.userPointService.rabbitmq;

import com.common.data.user.UserPoint;
import com.common.dto.user.UserPointDTO;
import com.common.mapper.UserPointMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.userPointService.service.UserPointService;
import com.rabbitmq.client.Channel;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.support.AmqpHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQRollbackLogActivityConsumer {

    @Autowired
    private UserPointService userPointService;

    @Autowired
    private UserPointMapper userPointMapper;

    @RabbitListener(queues = "notifications.log.point.queue", ackMode = "MANUAL")
    public void receiveNotification(String jsonMessage, Channel channel, @Header(AmqpHeaders.DELIVERY_TAG) long tag) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            UserPointDTO userPointDTO = objectMapper.readValue(jsonMessage, UserPointDTO.class);
            UserPoint userPointSave = userPointMapper.fromDTO(userPointDTO);
            userPointService.rollbackSavePoint(userPointSave);
            channel.basicAck(tag, false);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
