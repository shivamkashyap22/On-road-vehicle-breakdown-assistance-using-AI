package com.breakdown.service;

import com.breakdown.entity.Mechanic;
import com.breakdown.repository.MechanicRepository;
import com.breakdown.dto.LocationUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Toggle mechanic online/offline and update location.
 */
@Service
@RequiredArgsConstructor
public class MechanicService {

    private final MechanicRepository mechanicRepository;

    public Optional<Mechanic> findByUserId(Long userId) {
        return mechanicRepository.findByUserId(userId);
    }

    @Transactional
    public Mechanic toggleStatus(Long userId) {
        Mechanic m = mechanicRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("Mechanic not found"));
        m.setIsOnline(!m.getIsOnline());
        if (!m.getIsOnline()) {
            m.setIsAvailable(true);
        }
        return mechanicRepository.save(m);
    }

    @Transactional
    public Mechanic updateLocation(Long userId, LocationUpdateDto dto) {
        Mechanic m = mechanicRepository.findByUserId(userId).orElseThrow(() -> new IllegalArgumentException("Mechanic not found"));
        if (dto.getLatitude() != null) m.setLatitude(dto.getLatitude());
        if (dto.getLongitude() != null) m.setLongitude(dto.getLongitude());
        return mechanicRepository.save(m);
    }
}
