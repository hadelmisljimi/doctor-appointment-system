package com.diplomski.doctor_appointment_system.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        if (path.equals("/api/auth/login")
                || path.equals("/api/auth/register/patient")
                || path.startsWith("/v3/api-docs")
                || path.startsWith("/swagger-ui")) {

            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader("Authorization");

        if (header == null || !header.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            String token = header.substring(7);
            Claims claims = jwtUtil.extractAllClaims(token);

            String username = claims.getSubject();

            String role = (String) claims.get("role");
            if (role == null) role = "PATIENT";

            role = role.toUpperCase();

            var auth = new UsernamePasswordAuthenticationToken(
                    username,
                    null,
                    List.of(new SimpleGrantedAuthority("ROLE_" + role))
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

        } catch (ExpiredJwtException e) {

            sendError(response, 401,
                    "Token expired",
                    "Your session expired. Please login again."
            );
            return;

        } catch (JwtException e) {

            sendError(response, 401,
                    "Invalid token",
                    "JWT is invalid or corrupted. Please login again."
            );
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void sendError(HttpServletResponse response,
                           int status,
                           String error,
                           String message) throws IOException {

        response.setContentType("application/json");
        response.setStatus(status);

        new com.fasterxml.jackson.databind.ObjectMapper()
                .writeValue(response.getOutputStream(),
                        java.util.Map.of(
                                "status", status,
                                "error", error,
                                "message", message
                        ));
    }
}