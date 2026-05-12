package com.breakdown.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Breakdown request created by a user (driver).
 * mechanic_id assigned when a mechanic accepts; status tracks lifecycle.
 */
@Entity
@Table(name = "breakdown_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BreakdownRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "mechanic_id")
    private Long mechanicId;

    @Enumerated(EnumType.STRING)
    @Column(name = "problem_type", nullable = false)
    private ProblemType problemType;

    @Column(name = "user_latitude", precision = 10, scale = 8, nullable = false)
    private BigDecimal userLatitude;

    @Column(name = "user_longitude", precision = 11, scale = 8, nullable = false)
    private BigDecimal userLongitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDING;

    private String description;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}