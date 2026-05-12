package com.breakdown.controller;

import com.breakdown.dto.LocationUpdateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

/**
 * WebSocket: mechanic sends location updates; broadcast to /topic/request/{requestId}.
 */
@Controller
@RequiredArgsConstructor
public class WebSocketLocationController {

    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/location/{requestId}")
    public void sendLocation(@DestinationVariable Long requestId, LocationUpdateDto dto) {
        messagingTemplate.convertAndSend("/topic/request/" + requestId,
                Map.of("latitude", dto.getLatitude() != null ? dto.getLatitude() : 0,
                        "longitude", dto.getLongitude() != null ? dto.getLongitude() : 0));
    }
}
