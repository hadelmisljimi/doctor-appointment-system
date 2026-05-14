package com.diplomski.doctor_appointment_system.security;

import com.fasterxml.jackson.databind.ObjectMapper;

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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // =========================
        // IGNORE AUTH ENDPOINTS
        // =========================
        if (path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader =
                request.getHeader("Authorization");

        // =========================
        // NO TOKEN
        // =========================
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            filterChain.doFilter(request, response);
            return;
        }

        try {

            String token = authHeader.substring(7);

            Claims claims =
                    jwtUtil.extractAllClaims(token);

            String username =
                    claims.getSubject();

            String role =
                    claims.get("role", String.class);

            UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            List.of(
                                    new SimpleGrantedAuthority(
                                            "ROLE_" + role
                                    )
                            )
                    );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(auth);

        }

        // =========================
        // TOKEN EXPIRED
        // =========================
        catch (ExpiredJwtException e) {

            sendErrorResponse(
                    response,
                    request,
                    "JWT token expired"
            );

            return;
        }

        // =========================
        // INVALID TOKEN
        // =========================
        catch (JwtException e) {

            sendErrorResponse(
                    response,
                    request,
                    "Invalid JWT token"
            );

            return;
        }

        // =========================
        // OTHER ERRORS
        // =========================
        catch (Exception e) {

            sendErrorResponse(
                    response,
                    request,
                    "Authentication failed"
            );

            return;
        }

        filterChain.doFilter(request, response);
    }

    // =========================
    // CUSTOM JSON RESPONSE
    // =========================
    private void sendErrorResponse(
            HttpServletResponse response,
            HttpServletRequest request,
            String message
    ) throws IOException {

        response.setStatus(
                HttpServletResponse.SC_UNAUTHORIZED
        );

        response.setContentType("application/json");

        Map<String, Object> body =
                new HashMap<>();

        body.put("status", 401);
        body.put("error", "Unauthorized");
        body.put("message", message);
        body.put("path", request.getServletPath());

        ObjectMapper mapper =
                new ObjectMapper();

        mapper.writeValue(
                response.getOutputStream(),
                body
        );
    }
}