package com.breakdown.controller;

import com.breakdown.dto.BreakdownRequestDto;
import com.breakdown.dto.CreateBreakdownRequestDto;
import com.breakdown.entity.User;
import com.breakdown.service.BreakdownRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Breakdown request CRUD and status updates.
 * USER: create, my-requests, get by id.
 * MECHANIC: accept, reject, complete (via role check in service).
 */
@RestController
@RequestMapping("/api/breakdown")
@RequiredArgsConstructor
public class BreakdownRequestController {

    private final BreakdownRequestService requestService;

    @PostMapping("/request")
    public ResponseEntity<BreakdownRequestDto> create(@AuthenticationPrincipal User user,
                                                      @Valid @RequestBody CreateBreakdownRequestDto dto) {
        if (user.getRole() != com.breakdown.entity.Role.USER) {
            return ResponseEntity.status(403).build();
        }
        return ResponseEntity.ok(requestService.create(user.getId(), dto));
    }

    @GetMapping("/my-requests")
    public ResponseEntity<List<BreakdownRequestDto>> myRequests(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(requestService.myRequests(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BreakdownRequestDto> getById(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(requestService.getById(id, user.getId(), user.getRole() == com.breakdown.entity.Role.MECHANIC));
    }

    @PatchMapping("/{id}/accept")
    public ResponseEntity<BreakdownRequestDto> accept(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (user.getRole() != com.breakdown.entity.Role.MECHANIC) return ResponseEntity.status(403).build();
        Long mechanicId = requestService.getMechanicProfileId(user.getId());
        if (mechanicId == null) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(requestService.accept(id, mechanicId));
    }

    @PatchMapping("/{id}/reject")
    public ResponseEntity<BreakdownRequestDto> reject(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (user.getRole() != com.breakdown.entity.Role.MECHANIC) return ResponseEntity.status(403).build();
        Long mechanicId = requestService.getMechanicProfileId(user.getId());
        if (mechanicId == null) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(requestService.reject(id, mechanicId));
    }

    @PatchMapping("/{id}/start")
    public ResponseEntity<BreakdownRequestDto> start(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (user.getRole() != com.breakdown.entity.Role.MECHANIC) return ResponseEntity.status(403).build();
        Long mechanicId = requestService.getMechanicProfileId(user.getId());
        if (mechanicId == null) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(requestService.startProgress(id, mechanicId));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<BreakdownRequestDto> complete(@PathVariable Long id, @AuthenticationPrincipal User user) {
        if (user.getRole() != com.breakdown.entity.Role.MECHANIC) return ResponseEntity.status(403).build();
        Long mechanicId = requestService.getMechanicProfileId(user.getId());
        if (mechanicId == null) return ResponseEntity.status(403).build();
        return ResponseEntity.ok(requestService.complete(id, mechanicId));
    }
}
