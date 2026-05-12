package com.breakdown.service;

import com.breakdown.dto.BreakdownRequestDto;
import com.breakdown.dto.CreateBreakdownRequestDto;
import com.breakdown.entity.*;
import com.breakdown.repository.BreakdownRequestRepository;
import com.breakdown.repository.MechanicRepository;
import com.breakdown.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Create breakdown requests, assign nearest mechanic, update status.
 * Publishes status/location updates via WebSocket.
 */
@Service
@RequiredArgsConstructor
public class BreakdownRequestService {

    private final BreakdownRequestRepository requestRepository;
    private final MechanicRepository mechanicRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public BreakdownRequestDto create(Long userId, CreateBreakdownRequestDto dto) {
        BreakdownRequest req = BreakdownRequest.builder()
                .userId(userId)
                .problemType(dto.getProblemType())
                .userLatitude(dto.getUserLatitude())
                .userLongitude(dto.getUserLongitude())
                .description(dto.getDescription())
                .status(RequestStatus.PENDING)
                .build();
        req = requestRepository.save(req);
        // Request stays PENDING until a mechanic accepts via /api/breakdown/{id}/accept
        messagingTemplate.convertAndSend("/topic/request/" + req.getId(), mapToDto(req));
        return mapToDto(req);
    }

    public List<BreakdownRequestDto> myRequests(Long userId) {
        return requestRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public BreakdownRequestDto getById(Long id, Long userId, boolean isMechanic) {
        BreakdownRequest req = requestRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Request not found"));
        if (req.getUserId().equals(userId)) return mapToDto(req);
        if (isMechanic) {
            Long mechanicProfileId = mechanicRepository.findByUserId(userId).map(Mechanic::getId).orElse(null);
            if (mechanicProfileId != null && mechanicProfileId.equals(req.getMechanicId())) return mapToDto(req);
        }
        throw new IllegalArgumentException("Forbidden");
    }

    /** Resolve mechanic profile id from user id (for role MECHANIC). */
    public Long getMechanicProfileId(Long userId) {
        return mechanicRepository.findByUserId(userId).map(Mechanic::getId).orElse(null);
    }

    public BreakdownRequestDto getByIdForMechanic(Long requestId, Long mechanicId) {
        BreakdownRequest req = requestRepository.findById(requestId).orElseThrow(() -> new IllegalArgumentException("Request not found"));
        if (!req.getMechanicId().equals(mechanicId)) {
            throw new IllegalArgumentException("Forbidden");
        }
        return mapToDto(req);
    }

    @Transactional
    public BreakdownRequestDto accept(Long requestId, Long mechanicId) {
        BreakdownRequest req = requestRepository.findById(requestId).orElseThrow(() -> new IllegalArgumentException("Request not found"));
        if (req.getStatus() != RequestStatus.PENDING) {
            throw new IllegalArgumentException("Request already processed");
        }
        Mechanic m = mechanicRepository.findByUserId(mechanicId).orElseThrow();
        req.setMechanicId(m.getId());
        req.setStatus(RequestStatus.ACCEPTED);
        m.setIsAvailable(false);
        mechanicRepository.save(m);
        req = requestRepository.save(req);
        messagingTemplate.convertAndSend("/topic/request/" + req.getId(), mapToDto(req));
        return mapToDto(req);
    }

    @Transactional
    public BreakdownRequestDto reject(Long requestId, Long mechanicId) {
        BreakdownRequest req = requestRepository.findById(requestId).orElseThrow(() -> new IllegalArgumentException("Request not found"));
        Long profileId = getMechanicProfileId(mechanicId);
        if (req.getStatus() != RequestStatus.PENDING || (req.getMechanicId() != null && !req.getMechanicId().equals(profileId))) {
            throw new IllegalArgumentException("Cannot reject");
        }
        req.setStatus(RequestStatus.REJECTED);
        req = requestRepository.save(req);
        messagingTemplate.convertAndSend("/topic/request/" + req.getId(), mapToDto(req));
        return mapToDto(req);
    }

    @Transactional
    public BreakdownRequestDto startProgress(Long requestId, Long mechanicId) {
        BreakdownRequest req = requestRepository.findById(requestId).orElseThrow(() -> new IllegalArgumentException("Request not found"));
        if (!req.getMechanicId().equals(getMechanicProfileId(mechanicId))) throw new IllegalArgumentException("Forbidden");
        req.setStatus(RequestStatus.IN_PROGRESS);
        req = requestRepository.save(req);
        messagingTemplate.convertAndSend("/topic/request/" + req.getId(), mapToDto(req));
        return mapToDto(req);
    }

    @Transactional
    public BreakdownRequestDto complete(Long requestId, Long mechanicId) {
        BreakdownRequest req = requestRepository.findById(requestId).orElseThrow(() -> new IllegalArgumentException("Request not found"));
        if (!req.getMechanicId().equals(getMechanicProfileId(mechanicId))) throw new IllegalArgumentException("Forbidden");
        req.setStatus(RequestStatus.COMPLETED);
        Mechanic m = mechanicRepository.findById(getMechanicProfileId(mechanicId)).orElse(null);
        if (m != null) {
            m.setIsAvailable(true);
            mechanicRepository.save(m);
        }
        req = requestRepository.save(req);
        messagingTemplate.convertAndSend("/topic/request/" + req.getId(), mapToDto(req));
        return mapToDto(req);
    }

    /** Incoming requests: PENDING with no mechanic assigned yet (any online mechanic can accept). */
    public List<BreakdownRequestDto> incomingForMechanic(Long mechanicProfileId) {
        List<BreakdownRequest> pending = requestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.PENDING);
        return pending.stream()
                .filter(r -> r.getMechanicId() == null)
                .limit(20)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private BreakdownRequestDto mapToDto(BreakdownRequest req) {
        String userFullName = userRepository.findById(req.getUserId()).map(User::getFullName).orElse("");
        String mechanicFullName = req.getMechanicId() != null
                ? userRepository.findById(mechanicRepository.findById(req.getMechanicId()).map(Mechanic::getUserId).orElse(null)).map(User::getFullName).orElse("")
                : "";
        return BreakdownRequestDto.builder()
                .id(req.getId())
                .userId(req.getUserId())
                .mechanicId(req.getMechanicId())
                .problemType(req.getProblemType())
                .userLatitude(req.getUserLatitude())
                .userLongitude(req.getUserLongitude())
                .status(req.getStatus())
                .description(req.getDescription())
                .createdAt(req.getCreatedAt())
                .userFullName(userFullName)
                .mechanicFullName(mechanicFullName)
                .build();
    }
}