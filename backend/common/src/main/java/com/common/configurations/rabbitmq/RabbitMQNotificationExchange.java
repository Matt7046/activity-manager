package com.common.configurations.rabbitmq;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQNotificationExchange {

    @Value("${rabbit.exchange.name.notification}")
    private String exchangeName; 

    @Bean
    public DirectExchange directExchangeNotification() {
        return new DirectExchange(exchangeName);
    }

    @Bean
    public Queue notificationQueue() {
        return QueueBuilder.durable("notifications.queue").build();
    }

    @Bean
    public Binding binding(Queue notificationQueue, @Qualifier("directExchangeNotification") DirectExchange exchange) {
        return BindingBuilder.bind(notificationQueue).to(exchange).with("notification.family");
    }

}