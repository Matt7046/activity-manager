package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {
        "com.authService",
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
public class AuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(AuthApplication.class, args);
    }
}