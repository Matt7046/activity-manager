package com.activityService.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.activityService.service.ActivityQueryService;
import com.common.data.activity.ActivityDocument;

@RestController
@RequestMapping("/api/activity")
public class ActivityQueryController {
    private final ActivityQueryService queryService;
    public ActivityQueryController(ActivityQueryService queryService) {
        this.queryService = queryService;
    }
    @GetMapping
    public Page<ActivityDocument> search(
            @RequestParam String subTesto,
            @PageableDefault(size = 20) Pageable pageable) {

        return queryService.search(subTesto, pageable);
    }
}
