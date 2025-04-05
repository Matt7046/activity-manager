package com.common.configurations;

import java.util.List;
import java.util.Map;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${rabbit.exchange.name}")
    private String exchangeName; 

    @Bean
    public DirectExchange directExchange() {
        return new DirectExchange(exchangeName);
    }

    @Bean
    public Queue notificationQueue() {
        return QueueBuilder.durable("notifications.queue").build();
    }

    @Bean
    public Binding binding(Queue notificationQueue, DirectExchange exchange) {
        return BindingBuilder.bind(notificationQueue).to(exchange).with("notification.family");
    }

}