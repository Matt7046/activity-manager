package com.common.data.activity.event;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public record ActivityEnrichedEvent(
        String _id,
        String subTesto,
        String nome,
        Long points,
        String email,
        String category
) {

    // Costruttore da JsonNode

    public ActivityEnrichedEvent(String _id) {
        this(_id, null, null, null, null, null);
    }

    public ActivityEnrichedEvent(JsonNode activity) {
        this(
                activity.path("_id").asText(null),
                activity.path("subTesto").asText(null),
                activity.path("nome").asText(null),
                activity.path("points").isMissingNode() || activity.path("points").isNull()
                        ? null
                        : activity.path("points").asLong(),
                activity.path("email").asText(null),
                activity.path("category").asText(null)
        );
    }

   // Costruttore da ActivityCreateEvent + categoria
    public ActivityEnrichedEvent(ActivityCreateEvent activity, String categoryNew) {
        this(
                activity._id(),
                activity.subTesto(),
                activity.nome(),
                activity.points(),
                activity.email(),
                categoryNew
        );
    }

    public ObjectNode addId(String identificativo)
    {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode node = mapper.createObjectNode();
        node.put("_id", identificativo);
        return node;
    }
}