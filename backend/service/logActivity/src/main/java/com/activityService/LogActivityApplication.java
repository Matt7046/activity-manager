package com.activityService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = { 
    "com.repository.logActivity"
})
@SpringBootApplication(scanBasePackages = {
    "com.activityManager", 
    "com.repository", 
    "com.common.configurations",
    "com.activityService",
    "com.common"
})
public class LogActivityApplication {

    public static void main(String[] args) {
        SpringApplication.run(LogActivityApplication.class, args);
    }
}