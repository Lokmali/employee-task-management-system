package com.etms.security;

import com.etms.config.JwtProperties;
import com.etms.entity.Role;
import com.etms.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Creates and reads JWT tokens.
 * A JWT is a signed string: header.payload.signature — the client sends it on each request.
 */
@Service
public class JwtService {

    private final JwtProperties jwtProperties;

    public JwtService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
    }

    /** Build a token that carries the user's email (subject) and role claim. */
    public String generateToken(User user) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + jwtProperties.getExpirationMs());

        return Jwts.builder()
                .subject(user.getEmail())
                .claim("role", user.getRole().name())
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey())
                .compact();
    }

    public String extractEmail(String token) {
        return parseClaims(token).getSubject();
    }

    public Role extractRole(String token) {
        String role = parseClaims(token).get("role", String.class);
        return Role.valueOf(role);
    }

    /** Token is valid if signature matches and it is not expired. */
    public boolean isTokenValid(String token, UserDetailsEmailHolder user) {
        String email = extractEmail(token);
        return email.equals(user.getUsername()) && !isExpired(token);
    }

    public boolean isExpired(String token) {
        return parseClaims(token).getExpiration().before(new Date());
    }

    private Claims parseClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /** HMAC-SHA key from the configured secret (UTF-8 bytes; must be >= 32 characters). */
    private SecretKey signingKey() {
        byte[] keyBytes = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /** Tiny helper so JwtService does not depend on the full UserDetails type name in isTokenValid. */
    public interface UserDetailsEmailHolder {
        String getUsername();
    }
}
