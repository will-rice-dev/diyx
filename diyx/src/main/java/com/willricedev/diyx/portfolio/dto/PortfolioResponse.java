package com.willricedev.diyx.portfolio.dto;

import java.time.Instant;
import java.util.Map;

public record PortfolioResponse(
        Long id,
        String name,
        Map<String, Float> stocks,
        Instant createdAt,
        Instant updatedAt
) {}
