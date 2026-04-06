package com.activityService.service;

import org.springframework.stereotype.Service;

import com.activityService.repository.elastic.ActivityDocumentRepository;
import com.common.data.activity.ActivityDocument;
import com.common.data.activity.event.ActivityCreateEvent;

@Service
public class ActivitySearchService {

    private final ActivityDocumentRepository repository;

    public ActivitySearchService(ActivityDocumentRepository repository) {
        this.repository = repository;
    }

    /**
     * Inserisce o aggiorna un documento Elastic.
     * Serve sia per la creazione sia per l'update.
     */
    public void index(ActivityCreateEvent event) {
        ActivityDocument doc = new ActivityDocument(
                event._id(),
                event.subTesto(),
                event.nome(),
                event.points(),
                event.email()
        );
        repository.save(doc); // save = upsert in Elasticsearch
    }

    /**
     * Rimuove un documento Elastic tramite id.
     */
    public void remove(String id) {
        repository.deleteById(id);
    }
}
