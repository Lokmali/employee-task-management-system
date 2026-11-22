package com.etms.dto;

import java.time.Instant;
import java.util.Map;

/**
 * Common JSON shape for every API error.
 * Example: {"timestamp":"...","status":404,"error":"Not Found","message":"...","fieldErrors":{}}
 */
public record ErrorResponse(
        Instant timestamp,
        int status,
        String error,
        String message,
        String path,
        Map<String, String> fieldErrors
) {
}
