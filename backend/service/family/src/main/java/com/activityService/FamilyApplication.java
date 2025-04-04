package com.activityService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
        "com.activityManager",
        "com.activityBusinessLogic",
        "com.repository",
        "com.common.configurations",
        "com.activityService",
        "com.common"
})
public class FamilyApplication {

    public static void main(String[] args) {
        SpringApplication.run(FamilyApplication.class, args);
    }
}