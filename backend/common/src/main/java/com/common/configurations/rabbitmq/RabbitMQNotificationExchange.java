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

    @Value("${rabbitmq.exchange.name.notification}")
    private String exchangeName;

    @Value("${rabbitmq.exchange.routingKey.notification}")
    private String routingKeyNotification;

    @Value("${rabbitmq.exchange.routingKey.email}")
    private String routingKeyEmail;

    @Bean
    public DirectExchange directExchangeNotification() {
        return new DirectExchange(exchangeName);
    }

    @Bean
    public Queue notificationQueue() {
        return QueueBuilder.durable("notifications.queue").build();
    }

    @Bean
    public Queue emailQueue() {
        return QueueBuilder.durable("email.queue").build();
    }

    @Bean
    public Binding bindingNotification(Queue notificationQueue, @Qualifier("directExchangeNotification") DirectExchange exchange) {
        return BindingBuilder.bind(notificationQueue).to(exchange).with(routingKeyNotification);
    }

    @Bean
    public Binding bindingEmail(Queue emailQueue, @Qualifier("directExchangeNotification") DirectExchange exchange) {
        return BindingBuilder.bind(emailQueue).to(exchange).with(routingKeyEmail);
    }

}