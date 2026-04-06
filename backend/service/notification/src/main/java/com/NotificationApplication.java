package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = {
        "com.notificationService.repository",
})
@SpringBootApplication(scanBasePackages = {
        "com.notificationService",
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
public class NotificationApplication {

    public static void main(String[] args) {
        SpringApplication.run(NotificationApplication.class, args);
    }
}