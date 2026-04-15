package com.common.configurations.rabbitmq;

import com.common.data.activity.event.ActivityCreateEvent;
import com.common.data.activity.event.ActivityEnrichedEvent;
import com.fasterxml.jackson.core.JsonProcessingException;

public interface SearchPublisher {
    void publishCreate(ActivityCreateEvent event);
    void publishEnriched(ActivityEnrichedEvent event);
    void publishDeleteEnriched(String event);

}