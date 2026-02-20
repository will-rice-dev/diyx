package com.willricedev.diyx.portfolio.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.Map;

public record CreatePortfolioRequest(
        @NotBlank String name,
        @NotNull Map<@NotBlank String, Float> stocks
) {}
