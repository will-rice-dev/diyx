package com.willricedev.diyx.user.dto;

import com.willricedev.diyx.user.Theme;

public record UpdateSettingsRequest(String timezone, Theme theme) {}
