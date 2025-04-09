package com.common.configurations;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQPointExchange {

    @Value("${rabbit.exchange.name.point}")
    private String exchangeName; 

    @Bean
    public DirectExchange directExchangePoint() {
        return new DirectExchange(exchangeName);
    }

    @Bean
    public Queue notificationQueueLogActivity() {
        return QueueBuilder.durable("notifications.log.point.queue").build();
    }

    @Bean
    public Binding bindingLogActivity(Queue notificationQueueLogActivity,@Qualifier("directExchangePoint") DirectExchange exchange) {
        return BindingBuilder.bind(notificationQueueLogActivity).to(exchange).with("point.log.activity");
    }

}