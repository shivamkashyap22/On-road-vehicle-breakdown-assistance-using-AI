package com.breakdown.repository;

import com.breakdown.entity.BreakdownRequest;
import com.breakdown.entity.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BreakdownRequestRepository extends JpaRepository<BreakdownRequest, Long> {
    List<BreakdownRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<BreakdownRequest> findByMechanicIdOrderByCreatedAtDesc(Long mechanicId);
    List<BreakdownRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);
}