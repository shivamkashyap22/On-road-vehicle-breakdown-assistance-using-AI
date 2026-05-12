package com.breakdown.repository;

import com.breakdown.entity.Mechanic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface MechanicRepository extends JpaRepository<Mechanic, Long> {
    Optional<Mechanic> findByUserId(Long userId);

    /**
     * Find online and available mechanics for assigning requests.
     */
    @Query("SELECT m FROM Mechanic m WHERE m.isOnline = true AND m.isAvailable = true AND m.latitude IS NOT NULL AND m.longitude IS NOT NULL")
    List<Mechanic> findOnlineAvailableMechanics();
}
