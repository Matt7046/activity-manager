package com.common.data.activity.event;

import com.fasterxml.jackson.databind.JsonNode;

public record ActivityDeleteEvent(
        String _id,
        String subTesto,
        String nome,
        Long points,
        String email) {
    public ActivityDeleteEvent(JsonNode activity) {
         this(
            activity.path("_id").asText(null),
            activity.path("subTesto").asText(null),
            activity.path("nome").asText(null),
            activity.path("points").isMissingNode() || activity.path("points").isNull()
                ? null
                : activity.path("points").asLong(),
            activity.path("email").asText(null)
        );
    }

}