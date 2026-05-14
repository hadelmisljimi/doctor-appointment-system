package com.diplomski.doctor_appointment_system.security;

import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Component
public class CustomAccessDeniedHandler
        implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request,
                       HttpServletResponse response,
                       AccessDeniedException accessDeniedException)
            throws IOException, ServletException {

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);

        String message = "Access denied";

        String uri = request.getRequestURI();

        // =========================
        // CUSTOM ROLE MESSAGES
        // =========================

        if (uri.contains("/api/doctors")) {
            message = "You must login as ADMIN";
        }

        else if (uri.contains("/api/patients")) {
            message = "You must login as ADMIN or DOCTOR";
        }

        else if (uri.contains("/api/appointments")) {
            message = "You do not have permission for this action";
        }

        Map<String, Object> body = new HashMap<>();

        body.put("status", 403);
        body.put("error", "Forbidden");
        body.put("message", message);
        body.put("path", request.getServletPath());

        ObjectMapper mapper = new ObjectMapper();

        mapper.writeValue(response.getOutputStream(), body);
    }
}