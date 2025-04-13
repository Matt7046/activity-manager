package com.aboutService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@EnableMongoRepositories(basePackages = "com.repository.about")
@SpringBootApplication(scanBasePackages = {
        "com.aboutService",
        "com.common"
})
public class AboutApplication {

    public static void main(String[] args) {
        SpringApplication.run(AboutApplication.class, args);
    }
}