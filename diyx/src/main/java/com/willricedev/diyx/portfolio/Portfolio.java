package com.willricedev.diyx.portfolio;

import com.willricedev.diyx.user.InstantConverter;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.Map;

@Entity
@Table(name = "portfolios")
public class Portfolio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String name;

    @Convert(converter = StocksConverter.class)
    @Column(nullable = false)
    private Map<String, Float> stocks;

    @Convert(converter = InstantConverter.class)
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    @Convert(converter = InstantConverter.class)
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    private void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    private void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Map<String, Float> getStocks() { return stocks; }
    public void setStocks(Map<String, Float> stocks) { this.stocks = stocks; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
