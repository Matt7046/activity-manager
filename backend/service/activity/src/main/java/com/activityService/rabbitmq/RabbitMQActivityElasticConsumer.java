package com.activityService.rabbitmq;

import com.activityService.repository.elastic.ActivityDocumentRepository;
import com.common.data.activity.ActivityDocument;
import com.common.data.activity.event.ActivityEnrichedEvent;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQActivityElasticConsumer {

    private final ActivityDocumentRepository repository;

    public RabbitMQActivityElasticConsumer(ActivityDocumentRepository repository) {
        this.repository = repository;
    }

    @RabbitListener(queues = "search.elastic.queue")
    public void handleEnriched(ActivityEnrichedEvent event) {

        ActivityDocument doc = new ActivityDocument();
        doc.setIdentificativo(event._id());
        doc.setNome(event.nome());
        doc.setSubTesto(event.subTesto());
        doc.setPoints(event.points());
        doc.setEmail(event.email());
        doc.setCategory(event.category());

        repository.save(doc);
    }

}
