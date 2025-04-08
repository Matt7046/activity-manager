package com.pointService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.repository.point")
@SpringBootApplication(scanBasePackages = {
    "com.repository",
    "com.common.configurations",
    "com.pointService",
    "com.common"
})
public class PointApplication {

    public static void main(String[] args) {
        SpringApplication.run(PointApplication.class, args);
    }
}