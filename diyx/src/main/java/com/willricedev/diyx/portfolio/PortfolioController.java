package com.willricedev.diyx.portfolio;

import com.willricedev.diyx.portfolio.dto.CreatePortfolioRequest;
import com.willricedev.diyx.portfolio.dto.PortfolioResponse;
import com.willricedev.diyx.portfolio.dto.UpdatePortfolioRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @PostMapping
    public ResponseEntity<PortfolioResponse> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreatePortfolioRequest request) {
        PortfolioResponse response = portfolioService.create(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<PortfolioResponse>> findAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(portfolioService.findAll(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PortfolioResponse> findById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        return ResponseEntity.ok(portfolioService.findById(userDetails.getUsername(), id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<PortfolioResponse> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdatePortfolioRequest request) {
        return ResponseEntity.ok(portfolioService.update(userDetails.getUsername(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        portfolioService.delete(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
