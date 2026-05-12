package com.breakdown.controller;

import com.breakdown.dto.BreakdownRequestDto;
import com.breakdown.dto.LocationUpdateDto;
import com.breakdown.entity.Mechanic;
import com.breakdown.entity.User;
import com.breakdown.service.BreakdownRequestService;
import com.breakdown.service.MechanicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Mechanic: toggle online, update location, list incoming requests.
 */
@RestController
@RequestMapping("/api/mechanic")
@RequiredArgsConstructor
public class MechanicController {

    private final MechanicService mechanicService;
    private final BreakdownRequestService requestService;

    @GetMapping("/incoming")
    public ResponseEntity<List<BreakdownRequestDto>> incoming(@AuthenticationPrincipal User user) {
        if (user.getRole() != com.breakdown.entity.Role.MECHANIC) {
            return ResponseEntity.status(403).build();
        }
        Long mechanicId = requestService.getMechanicProfileId(user.getId());
        if (mechanicId == null) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(requestService.incomingForMechanic(mechanicId));
    }

    @PatchMapping("/status")
    public ResponseEntity<Mechanic> toggleStatus(@AuthenticationPrincipal User user) {
        if (user.getRole() != com.breakdown.entity.Role.MECHANIC) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(mechanicService.toggleStatus(user.getId()));
    }

    @PutMapping("/location")
    public ResponseEntity<Mechanic> updateLocation(@AuthenticationPrincipal User user,
                                                    @RequestBody LocationUpdateDto dto) {
        if (user.getRole() != com.breakdown.entity.Role.MECHANIC) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(mechanicService.updateLocation(user.getId(), dto));
    }
}
