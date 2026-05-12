package com.breakdown.entity;

/**
 * Lifecycle status of a breakdown request.
 * Timeline: PENDING -> ACCEPTED -> IN_PROGRESS -> COMPLETED (or REJECTED).
 */
public enum RequestStatus {
    PENDING,
    ACCEPTED,
    IN_PROGRESS,
    COMPLETED,
    REJECTED
}
