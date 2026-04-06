package com.activityService.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.common.data.activity.ActivityDocument;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ActivityQueryService {

    private final ElasticsearchOperations operations;

    public ActivityQueryService(ElasticsearchOperations operations) {
        this.operations = operations;
    }

    public Page<ActivityDocument> search(String subTesto, Pageable pageable) {
        // Costruisci query con CriteriaQuery
        Criteria criteria = Criteria.where("subTesto").is(subTesto);
        CriteriaQuery query = new CriteriaQuery(criteria).setPageable(pageable);
        // Esegui query
        SearchHits<ActivityDocument> hits = operations.search(query, ActivityDocument.class);
        // Converti SearchHits in Page<ActivityDocument>
        List<ActivityDocument> content = hits.stream()
                .map(SearchHit::getContent)
                .collect(Collectors.toList());
        return new PageImpl<>(content, pageable, hits.getTotalHits());
    }
}
