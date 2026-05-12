package com.breakdown.entity;

/**
 * Types of vehicle breakdown problems that a user can report.
 * Used in breakdown_requests table and UI problem selection cards.
 */
public enum ProblemType {
    BATTERY_DEAD,
    TYRE_PUNCTURE,
    ENGINE_OVERHEATING,
    VEHICLE_NOT_STARTING
}
