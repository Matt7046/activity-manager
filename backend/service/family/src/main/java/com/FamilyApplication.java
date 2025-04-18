package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = {
        "com.repository.family",
})
@SpringBootApplication(scanBasePackages = {
        "com.familyService",
        "com.common"
})
public class FamilyApplication {

    public static void main(String[] args) {
        SpringApplication.run(FamilyApplication.class, args);
    }
}