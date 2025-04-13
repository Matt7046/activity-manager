package com.userPointService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.repository.userPoint")
@SpringBootApplication(scanBasePackages = {
    "com.userPointService",
    "com.common"
})
public class UserPointApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserPointApplication.class, args);
    }
}