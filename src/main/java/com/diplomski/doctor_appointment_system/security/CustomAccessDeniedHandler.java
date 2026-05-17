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
        response.setStatus(403);

        String path = request.getRequestURI();
        String method = request.getMethod();

        String message = buildMessage(path, method);

        new ObjectMapper().writeValue(response.getOutputStream(),
                Map.of(
                        "status", 403,
                        "error", "Forbidden",
                        "message", message,
                        "path", path,
                        "method", method
                ));
    }

    private String buildMessage(String path, String method) {

        // AUTH
        if (path.equals("/api/auth/register/doctor")) {
            return "Only ADMIN can register a doctor.";
        }

        if (path.equals("/api/auth/register/patient")
                || path.equals("/api/auth/login")) {
            return "This endpoint is public and does not require authentication.";
        }

        // DOCTORS
        if (path.startsWith("/api/doctors")) {
            if (method.equals("GET")) return "Anyone can view doctor data.";
            if (method.equals("POST")) return "Only ADMIN can create doctors.";
            if (method.equals("PUT")) return "Only ADMIN can update doctor data.";
            if (method.equals("DELETE")) return "Only ADMIN can delete doctors.";
        }

        // APPOINTMENTS
        if (path.startsWith("/api/appointments")) {
            if (method.equals("GET")) return "Anyone can view appointments.";
            if (method.equals("POST")) return "Anyone can create appointments.";
            if (method.equals("PUT")) {
                if (path.contains("/cancel")) return "Only ADMIN or DOCTOR can cancel appointments.";
                if (path.contains("/complete")) return "Only ADMIN or DOCTOR can complete appointments.";
                return "Only ADMIN or DOCTOR can modify appointments.";
            }
        }

        // PATIENTS
        if (path.startsWith("/api/patients")) {
            if (method.equals("GET")) return "Anyone can view patient data.";
            if (method.equals("POST")) return "Anyone can register as patient.";
            if (method.equals("PUT")) return "Only ADMIN or DOCTOR can update patient data.";
            if (method.equals("DELETE")) return "Only ADMIN or DOCTOR can delete patients.";
        }

        // SEARCH
        if (path.startsWith("/api/search")) {
            return "Anyone can use search.";
        }

        return "You do not have permission to access this resource.";
    }
}