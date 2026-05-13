package com.diplomski.doctor_appointment_system.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // 🔥 FIX: STATIC KEY (NE SMIJE SE MIJENJATI NA RESTART)
    private final Key key = Keys.hmacShaKeyFor(
            "mySecretKeymySecretKeymySecretKeymySecretKey".getBytes()
    );

    private final long EXPIRATION = 1000 * 60 * 60 * 10; // 10h

    // GENERATE TOKEN
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // EXTRACT CLAIMS
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}