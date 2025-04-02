package com.activityService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.repository.points")
@SpringBootApplication(scanBasePackages = {
    "com.activityManager", 
    "com.repository", 
    "com.common.configurations",
    "com.activityService",
    "com.common"
})
public class PointsApplication {

    public static void main(String[] args) {
        SpringApplication.run(PointsApplication.class, args);
    }
}