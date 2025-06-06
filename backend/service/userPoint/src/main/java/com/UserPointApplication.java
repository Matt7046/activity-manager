package com;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.userPointService.repository")
@SpringBootApplication(scanBasePackages = {
    "com.userPointService",
    "com.common"
})
public class UserPointApplication {

    public static void main(String[] args) {
        SpringApplication.run(UserPointApplication.class, args);
    }
}