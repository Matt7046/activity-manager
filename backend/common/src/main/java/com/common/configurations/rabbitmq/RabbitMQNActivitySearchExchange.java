package com.common.configurations.rabbitmq;

import org.springframework.amqp.core.*;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQNActivitySearchExchange {

    @Value("${rabbitmq.exchange.name.activity.search.exchangeName}")
    private String exchangeName;

    // ========================
    // NUOVI (SEARCH / AI)
    // ========================
    @Value("${rabbitmq.routingKey.activity.search.create}")
    private String routingKeySearchCreate;

    @Value("${rabbitmq.routingKey.activity.search.enriched}")
    private String routingKeySearchEnriched;

    @Bean
    public DirectExchange directExchangeActivitySearch() {
        return new DirectExchange(exchangeName);
    }

    // ========================
    // NUOVE QUEUE (SEARCH)
    // ========================

    @Bean
    public Queue searchAIQueue() {
        return QueueBuilder.durable("search.ai.queue")
                .withArgument("x-dead-letter-exchange", exchangeName)
                .withArgument("x-dead-letter-routing-key", "search.ai.dlq")
                .build();
    }

    @Bean
    public Queue searchElasticQueue() {
        return QueueBuilder.durable("search.elastic.queue").build();
    }

    @Bean
    public Queue searchAIDLQ() {
        return QueueBuilder.durable("search.ai.dlq").build();
    }

    // ========================
    // BINDINGS SEARCH
    // ========================

    // CREATE → AI
    @Bean
    public Binding bindingSearchCreate(
            Queue searchAIQueue,
            @Qualifier("directExchangeActivitySearch") DirectExchange exchange) {

        return BindingBuilder
                .bind(searchAIQueue)
                .to(exchange)
                .with(routingKeySearchCreate);
    }

    // ENRICHED → ELASTIC
    @Bean
    public Binding bindingSearchEnriched(
            Queue searchElasticQueue,
            @Qualifier("directExchangeActivitySearch") DirectExchange exchange) {

        return BindingBuilder
                .bind(searchElasticQueue)
                .to(exchange)
                .with(routingKeySearchEnriched);
    }
}