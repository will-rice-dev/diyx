package com.willricedev.diyx.user.dto;

import java.time.Instant;

public record UserResponse(Long id, String username, Instant createdAt, String token) {}
