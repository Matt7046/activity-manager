package com.activityService.repository.elastic;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
import com.common.data.activity.ActivityDocument;

import java.util.List;

@Repository
public interface ActivityDocumentRepository extends ElasticsearchRepository<ActivityDocument, String> {

    // Qui puoi aggiungere query personalizzate se serve
    // es. List<ActivityDocument> findByUserId(String userId);

    List<ActivityDocument> findByCategoryContaining(String text);

    void deleteByIdentificativo(String identificativo);
    ActivityDocument findByIdentificativo(String identificativo);

}
