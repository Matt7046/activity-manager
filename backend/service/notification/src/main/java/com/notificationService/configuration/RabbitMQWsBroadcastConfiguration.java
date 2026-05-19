package com.notificationService.configuration;

import org.springframework.amqp.core.AnonymousQueue;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQWsBroadcastConfiguration {

    @Value("${rabbitmq.exchange.name.notification-ws}")
    private String fanoutExchangeName;

    @Bean
    public FanoutExchange notificationWsFanoutExchange() {
        return new FanoutExchange(fanoutExchangeName, true, false);
    }

    /** Coda esclusiva per istanza (nome random, auto-delete alla chiusura del consumer). */
    @Bean("notificationWsInstanceQueue")
    public Queue notificationWsInstanceQueue() {
        return new AnonymousQueue();
    }

    @Bean
    public Binding notificationWsInstanceBinding(Queue notificationWsInstanceQueue,
            FanoutExchange notificationWsFanoutExchange) {
        return BindingBuilder.bind(notificationWsInstanceQueue).to(notificationWsFanoutExchange);
    }
}
