package com.common.configurations.rabbitmq;

import com.common.data.activity.event.ActivityCreateEvent;
import com.common.data.activity.event.ActivityEnrichedEvent;

public interface SearchPublisher {
    void publishCreate(ActivityCreateEvent event);
    void publishEnriched(ActivityEnrichedEvent event);
}