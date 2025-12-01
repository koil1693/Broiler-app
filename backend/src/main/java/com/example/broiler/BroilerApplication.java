package com.example.broiler;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.broiler") // Explicitly scan the base package
public class BroilerApplication {
    public static void main(String[] args) {
        SpringApplication.run(BroilerApplication.class, args);
    }
}
