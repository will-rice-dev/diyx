package com.willricedev.diyx.user;

import com.willricedev.diyx.user.dto.SettingsResponse;
import com.willricedev.diyx.user.dto.UpdateSettingsRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Settings", description = "User settings endpoints")
@SecurityRequirement(name = "bearerAuth")
public class SettingsController {

    private final UserService userService;

    public SettingsController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me/settings")
    @Operation(summary = "Get current user settings")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Settings retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<SettingsResponse> getSettings(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getSettings(userDetails.getUsername()));
    }

    @PatchMapping("/me/settings")
    @Operation(summary = "Update current user settings")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Settings updated successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<SettingsResponse> updateSettings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateSettingsRequest request) {
        return ResponseEntity.ok(userService.updateSettings(userDetails.getUsername(), request));
    }
}
