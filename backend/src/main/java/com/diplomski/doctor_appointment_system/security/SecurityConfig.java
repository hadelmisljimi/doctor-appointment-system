package com.diplomski.doctor_appointment_system.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final CustomAuthenticationEntryPoint entryPoint;

    public SecurityConfig(JwtFilter jwtFilter,
                          CustomAccessDeniedHandler accessDeniedHandler,
                          CustomAuthenticationEntryPoint entryPoint) {
        this.jwtFilter = jwtFilter;
        this.accessDeniedHandler = accessDeniedHandler;
        this.entryPoint = entryPoint;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        http.csrf(csrf -> csrf.disable());

        http.sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        http.exceptionHandling(ex -> ex
                .authenticationEntryPoint(entryPoint)
                .accessDeniedHandler(accessDeniedHandler)
        );

        http.authorizeHttpRequests(auth -> auth

                // AUTH
                .requestMatchers("/api/auth/register/patient").permitAll()
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .requestMatchers("/api/auth/register/doctor").hasRole("ADMIN")

                // APPOINTMENTS
                .requestMatchers(HttpMethod.GET, "/api/appointments/**").permitAll()
                .requestMatchers("/api/appointments/search").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/appointments")
                .hasAnyRole("ADMIN", "DOCTOR", "PATIENT")
                .requestMatchers(HttpMethod.PUT, "/api/appointments/**")
                .hasAnyRole("ADMIN", "DOCTOR")
                .requestMatchers(HttpMethod.DELETE, "/api/appointments/**")
                .hasAnyRole("ADMIN", "DOCTOR")

                // DOCTORS
                .requestMatchers(HttpMethod.GET, "/api/doctors/**")
                .permitAll()
                .requestMatchers(HttpMethod.POST, "/api/doctors").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/doctors/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/doctors/**").hasRole("ADMIN")

                // PATIENTS
                .requestMatchers(HttpMethod.GET, "/api/patients/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/patients")
                .hasAnyRole("ADMIN", "DOCTOR", "PATIENT")
                .requestMatchers(HttpMethod.PUT, "/api/patients/**")
                .hasAnyRole("ADMIN", "DOCTOR")
                .requestMatchers(HttpMethod.DELETE, "/api/patients/**")
                .hasAnyRole("ADMIN", "DOCTOR")

                // SEARCH
                .requestMatchers("/api/search").permitAll()

                .anyRequest().authenticated()
        );

        http.addFilterBefore(jwtFilter,
                UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration config = new CorsConfiguration();

        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
        ));

        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS"
        ));

        config.setAllowedHeaders(List.of("*"));

        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", config);

        return source;
    }
}