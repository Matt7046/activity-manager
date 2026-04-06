package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;


@SpringBootApplication(scanBasePackages = {
        "com.activityService",
        "com.logActivityService",
        "com.common.configurations.mongodb",
        "com.common.configurations.config",
        "com.common.configurations.encrypt",   
        "com.common.configurations.rabbitmq",
        "com.common.configurations.structure",
        "com.common.mapper",  
        "com.common.data",
        "com.common.dto",
        "com.common.structure"
})
@EnableMongoRepositories(basePackages = {
        "com.activityService.repository.mongodb",
        "com.logActivityService.repository.mongodb"
})
@EnableElasticsearchRepositories(basePackages = {
        "com.activityService.repository.elastic",
})
public class ActivityApplication {

    public static void main(String[] args) {
        SpringApplication.run(ActivityApplication.class, args);
    }
}