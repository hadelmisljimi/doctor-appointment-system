package com.diplomski.doctor_appointment_system.dto;

public class AuthResponse {

    private String token;
    private String role;

    public AuthResponse() {
    }

    public AuthResponse(String token, String role) {
        this.token = token;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getShortToken() {
        if (token == null) return null;
        return token.substring(0, Math.min(25, token.length())) + "...";
    }
}