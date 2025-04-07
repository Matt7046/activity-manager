package com.pointsService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.repository.points")
@SpringBootApplication(scanBasePackages = {
    "com.repository",
    "com.common.configurations",
    "com.pointsService",
    "com.common"
})
public class PointsApplication {

    public static void main(String[] args) {
        SpringApplication.run(PointsApplication.class, args);
    }
}