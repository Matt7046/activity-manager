package com.activityService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.repository.about")
@SpringBootApplication(scanBasePackages = {
    "com.activityManager", 
    "com.repository", 
    "com.activityManager.configurations",
    "com.activityService",
    "com.common"
})
public class AboutApplication {

    public static void main(String[] args) {
        SpringApplication.run(AboutApplication.class, args);
    }
}