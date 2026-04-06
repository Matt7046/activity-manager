package com;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.userPointService.repository")
@SpringBootApplication(scanBasePackages = {
    "com.userPointService",
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
public class UserPointApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserPointApplication.class, args);
    }
}