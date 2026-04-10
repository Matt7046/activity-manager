package com.notificationService.rabbitmq;

import com.common.configurations.rabbitmq.SearchPublisher;
import com.common.data.activity.event.ActivityCreateEvent;
import com.common.data.activity.event.ActivityEnrichedEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQActivityAIConsumer {

    private final SearchPublisher searchPublisher;

    public RabbitMQActivityAIConsumer(SearchPublisher searchPublisher) {
        this.searchPublisher = searchPublisher;
    }

    @RabbitListener(queues = "search.ai.queue")
    public void handleCreate(ActivityCreateEvent event) {

        // 👉 Qui fai enrichment (anche fake all'inizio)
        String category = categorize(event);

        ActivityEnrichedEvent enriched = new ActivityEnrichedEvent(
                event._id(),
                event.subTesto(),
                event.nome(),
                event.points(),
                event.email(),
                category
        );

        // 👉 Pubblica verso Elastic step
        searchPublisher.publishEnriched(enriched);
    }

    private String categorize(ActivityCreateEvent event) {
        // MOCK iniziale
        if (event.nome().toLowerCase().contains("sport")) return "SPORT";
        if (event.nome().toLowerCase().contains("studio")) return "STUDY";
        return "GENERIC";
    }
}