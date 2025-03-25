package com.activityService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.repository.register")
@SpringBootApplication(scanBasePackages = {
    "com.activityManager", 
    "com.repository", 
    "com.activityManager.configurations",
    "com.activityService",
    "com.common"
})
public class RegisterApplication {

    public static void main(String[] args) {
        SpringApplication.run(RegisterApplication.class, args);
    }
}