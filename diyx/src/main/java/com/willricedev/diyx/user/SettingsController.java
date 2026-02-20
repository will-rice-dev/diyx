package com.willricedev.diyx.user;

import com.willricedev.diyx.user.dto.SettingsResponse;
import com.willricedev.diyx.user.dto.UpdateSettingsRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class SettingsController {

    private final UserService userService;

    public SettingsController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me/settings")
    public ResponseEntity<SettingsResponse> getSettings(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getSettings(userDetails.getUsername()));
    }

    @PatchMapping("/me/settings")
    public ResponseEntity<SettingsResponse> updateSettings(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateSettingsRequest request) {
        return ResponseEntity.ok(userService.updateSettings(userDetails.getUsername(), request));
    }
}
