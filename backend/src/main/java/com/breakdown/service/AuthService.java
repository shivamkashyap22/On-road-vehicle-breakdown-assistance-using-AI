package com.breakdown.service;

import com.breakdown.dto.AuthResponse;
import com.breakdown.dto.LoginRequest;
import com.breakdown.dto.RegisterRequest;
import com.breakdown.entity.Mechanic;
import com.breakdown.entity.Role;
import com.breakdown.entity.User;
import com.breakdown.repository.MechanicRepository;
import com.breakdown.repository.UserRepository;
import com.breakdown.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final MechanicRepository mechanicRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = User.builder()
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .phone(req.getPhone())
                .role(req.getRole())
                .build();
        user = userRepository.save(user);
        if (user.getRole() == Role.MECHANIC) {
            mechanicRepository.save(Mechanic.builder()
                    .userId(user.getId())
                    .isOnline(false)
                    .isAvailable(true)
                    .build());
        }
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse login(LoginRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));
        if (!passwordEncoder.matches(req.getPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }
}