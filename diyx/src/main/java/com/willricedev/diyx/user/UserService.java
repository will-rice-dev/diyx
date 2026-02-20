package com.willricedev.diyx.user;

import com.willricedev.diyx.auth.JwtService;
import com.willricedev.diyx.user.dto.LoginRequest;
import com.willricedev.diyx.user.dto.RegisterRequest;
import com.willricedev.diyx.user.dto.SettingsResponse;
import com.willricedev.diyx.user.dto.UpdateSettingsRequest;
import com.willricedev.diyx.user.dto.UserResponse;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already taken");
        }
        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        User saved = userRepository.save(user);
        String token = jwtService.generateToken(saved.getUsername());
        return new UserResponse(saved.getId(), saved.getUsername(), saved.getCreatedAt(), token);
    }

    public UserResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username())
                .filter(u -> passwordEncoder.matches(request.password(), u.getPassword()))
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        String token = jwtService.generateToken(user.getUsername());
        return new UserResponse(user.getId(), user.getUsername(), user.getCreatedAt(), token);
    }

    public SettingsResponse getSettings(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return new SettingsResponse(user.getTimezone(), user.getTheme());
    }

    public SettingsResponse updateSettings(String username, UpdateSettingsRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (request.timezone() != null) user.setTimezone(request.timezone());
        if (request.theme() != null) user.setTheme(request.theme());
        userRepository.save(user);
        return new SettingsResponse(user.getTimezone(), user.getTheme());
    }
}
