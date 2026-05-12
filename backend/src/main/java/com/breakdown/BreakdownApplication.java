package com.breakdown;  // ✅ VERY IMPORTANT

import com.breakdown.entity.User;
import com.breakdown.entity.Role;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BreakdownApplication {

    public static void main(String[] args) {

        User user = User.builder()
                .email("test@gmail.com")
                .fullName("Test User")
                .passwordHash("123")
                .role(Role.USER)
                .build();

        System.out.println(user);

        SpringApplication.run(BreakdownApplication.class, args);
    }
}