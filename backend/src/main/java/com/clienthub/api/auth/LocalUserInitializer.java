package com.clienthub.api.auth;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@Profile("local")
public class LocalUserInitializer {
    @Bean
    ApplicationRunner localUser(JdbcTemplate jdbc, PasswordEncoder encoder) {
        return args -> {
            String password = System.getenv("DEMO_PASSWORD");
            if (password == null || password.length() < 12 || password.getBytes(java.nio.charset.StandardCharsets.UTF_8).length > 72)
                throw new IllegalStateException("Set DEMO_PASSWORD (12 characters minimum, 72 UTF-8 bytes maximum)");
            jdbc.update("INSERT INTO app_users(email,password_hash,role) VALUES (?,?,?) ON CONFLICT(email) DO NOTHING",
                "analyst@example.com",encoder.encode(password),"ANALYST");
        };
    }
}
