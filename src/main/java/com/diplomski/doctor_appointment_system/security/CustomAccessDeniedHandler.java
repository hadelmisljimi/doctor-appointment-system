package com.diplomski.doctor_appointment_system.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
public class CustomAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException ex) throws IOException {

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        String path = request.getRequestURI();

        String message;

        if (path.contains("/api/doctors")) {
            message = "Only ADMIN can register a doctor";
        } else if (path.contains("/api/patients")) {
            message = "Only ADMIN or DOCTOR have access";
        } else if (path.contains("/api/appointments")) {
            message = "You do not have permission for appointments";
        } else {
            message = "Access denied";
        }

        ObjectMapper mapper = new ObjectMapper();

        mapper.writeValue(response.getOutputStream(),
                Map.of(
                        "status", 403,
                        "error", "Forbidden",
                        "message", message,
                        "path", path
                )
        );
    }
}