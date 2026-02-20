package com.willricedev.diyx.portfolio;

import com.willricedev.diyx.portfolio.dto.CreatePortfolioRequest;
import com.willricedev.diyx.portfolio.dto.PortfolioResponse;
import com.willricedev.diyx.portfolio.dto.UpdatePortfolioRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
@Tag(name = "Portfolios", description = "Portfolio management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class PortfolioController {

    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @PostMapping
    @Operation(summary = "Create a portfolio")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Portfolio created successfully"),
        @ApiResponse(responseCode = "400", description = "Validation error"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<PortfolioResponse> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreatePortfolioRequest request) {
        PortfolioResponse response = portfolioService.create(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "List all portfolios for the current user")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Portfolios retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<List<PortfolioResponse>> findAll(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(portfolioService.findAll(userDetails.getUsername()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a portfolio by ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Portfolio retrieved successfully"),
        @ApiResponse(responseCode = "400", description = "Portfolio not found or access denied"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<PortfolioResponse> findById(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "Portfolio ID") @PathVariable Long id) {
        return ResponseEntity.ok(portfolioService.findById(userDetails.getUsername(), id));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update a portfolio")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Portfolio updated successfully"),
        @ApiResponse(responseCode = "400", description = "Validation error, portfolio not found, or access denied"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<PortfolioResponse> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "Portfolio ID") @PathVariable Long id,
            @Valid @RequestBody UpdatePortfolioRequest request) {
        return ResponseEntity.ok(portfolioService.update(userDetails.getUsername(), id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a portfolio")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Portfolio deleted successfully"),
        @ApiResponse(responseCode = "400", description = "Portfolio not found or access denied"),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @Parameter(description = "Portfolio ID") @PathVariable Long id) {
        portfolioService.delete(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }
}
