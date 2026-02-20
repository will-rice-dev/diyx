package com.willricedev.diyx.portfolio;

import com.willricedev.diyx.portfolio.dto.CreatePortfolioRequest;
import com.willricedev.diyx.portfolio.dto.PortfolioResponse;
import com.willricedev.diyx.portfolio.dto.UpdatePortfolioRequest;
import com.willricedev.diyx.user.User;
import com.willricedev.diyx.user.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    public PortfolioService(PortfolioRepository portfolioRepository, UserRepository userRepository) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
    }

    public PortfolioResponse create(String username, CreatePortfolioRequest request) {
        User user = resolveUser(username);
        validateStocks(request.stocks());
        if (portfolioRepository.existsByUserIdAndName(user.getId(), request.name())) {
            throw new IllegalArgumentException("Portfolio name already exists");
        }
        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(user.getId());
        portfolio.setName(request.name());
        portfolio.setStocks(request.stocks());
        return toResponse(portfolioRepository.save(portfolio));
    }

    public List<PortfolioResponse> findAll(String username) {
        User user = resolveUser(username);
        return portfolioRepository.findByUserId(user.getId()).stream()
                .map(this::toResponse)
                .toList();
    }

    public PortfolioResponse findById(String username, Long portfolioId) {
        User user = resolveUser(username);
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(portfolioId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
        return toResponse(portfolio);
    }

    public PortfolioResponse update(String username, Long portfolioId, UpdatePortfolioRequest request) {
        User user = resolveUser(username);
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(portfolioId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
        validateStocks(request.stocks());
        if (portfolioRepository.existsByUserIdAndNameAndIdNot(user.getId(), request.name(), portfolioId)) {
            throw new IllegalArgumentException("Portfolio name already exists");
        }
        portfolio.setName(request.name());
        portfolio.setStocks(request.stocks());
        return toResponse(portfolioRepository.save(portfolio));
    }

    public void delete(String username, Long portfolioId) {
        User user = resolveUser(username);
        Portfolio portfolio = portfolioRepository.findByIdAndUserId(portfolioId, user.getId())
                .orElseThrow(() -> new IllegalArgumentException("Portfolio not found"));
        portfolioRepository.delete(portfolio);
    }

    private User resolveUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private void validateStocks(Map<String, Float> stocks) {
        if (stocks == null || stocks.isEmpty()) {
            throw new IllegalArgumentException("Stocks must not be empty");
        }
        for (String ticker : stocks.keySet()) {
            if (ticker == null || ticker.isBlank()) {
                throw new IllegalArgumentException("Ticker symbols must not be blank");
            }
        }
        float sum = 0f;
        for (Float value : stocks.values()) {
            sum += value;
        }
        if (Math.abs(sum - 100.0f) > 0.01f) {
            throw new IllegalArgumentException("Stock allocations must sum to 100.0 (got " + sum + ")");
        }
    }

    private PortfolioResponse toResponse(Portfolio portfolio) {
        return new PortfolioResponse(
                portfolio.getId(),
                portfolio.getName(),
                portfolio.getStocks(),
                portfolio.getCreatedAt(),
                portfolio.getUpdatedAt()
        );
    }
}
