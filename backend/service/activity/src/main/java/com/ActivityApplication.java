package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = {
        "com.activityService.repository",
        "com.logActivityService.repository"
})
@SpringBootApplication(scanBasePackages = {
        "com.activityService",
        "com.logActivityService",
        "com.common"
})
public class ActivityApplication {

    public static void main(String[] args) {
        SpringApplication.run(ActivityApplication.class, args);
    }
}