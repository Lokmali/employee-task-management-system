package com.etms.dto;

/**
 * JSON body returned by {@code GET /api/health}.
 *
 * <p>A {@code record} is a Java 17 feature: an immutable data carrier.
 * The compiler generates the constructor, getters ({@code status()}, {@code message()}),
 * {@code equals}, {@code hashCode}, and {@code toString} for us.</p>
 *
 * <p>Jackson (the JSON library) turns this into:
 * {@code {"status":"UP","message":"..."}}</p>
 */
public record HealthResponse(String status, String message) {
}
