package com.diplomski.doctor_appointment_system.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    private static final String SECURITY_SCHEME_NAME = "LOGIN(Admin,Doctor or Patient)";

    @Bean
    public OpenAPI openAPI() {

        return new OpenAPI()

                // =========================
                // API METADATA
                // =========================
                .info(new Info()
                        .title("Doctor Appointment System REST API")
                        .version("v1.0.0")
                        .description(
                                "Backend system for managing doctors, patients and appointments. " +
                                        "JWT authentication is required for protected endpoints."
                        )

                )

                // =========================
                // GLOBAL SECURITY (JWT BEARER)
                // =========================
                .addSecurityItem(new SecurityRequirement()
                        .addList(SECURITY_SCHEME_NAME)
                )

                .components(new Components()
                        .addSecuritySchemes(
                                SECURITY_SCHEME_NAME,
                                new SecurityScheme()
                                        .name(SECURITY_SCHEME_NAME)
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description(
                                                "Take your JWT token from the auth/login option and insert it into the field below. "
                                        )
                        )
                );
    }
}