package com.activityService.rabbitmq;

import com.activityService.service.ActivitySearchService;
import com.common.data.activity.event.ActivityCreateEvent;
import com.common.data.activity.event.ActivityDeleteEvent;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class RabbitMQActivityEvent {

    private final ActivitySearchService searchService;

    public RabbitMQActivityEvent(ActivitySearchService searchService) {
        this.searchService = searchService;
    }

    @RabbitListener(queues = "activity.create.queue")
    public void onActivityCreated(ActivityCreateEvent event) {
        searchService.index(event);
    }

    @RabbitListener(queues = "activity.modify.queue")
    public void onActivityModify(ActivityCreateEvent event) {
        searchService.index(event);
    }

    @RabbitListener(queues = "activity.delete.queue")
    public void onActivityDelete(ActivityDeleteEvent event) {
        searchService.remove(event._id());
    }

}
