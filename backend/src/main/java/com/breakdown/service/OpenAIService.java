package com.breakdown.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import okhttp3.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAIService {

    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");
    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${openai.api-key}")
    private String apiKey;

    @Value("${openai.model:gpt-3.5-turbo}")
    private String model;

    @Value("${openai.url:https://api.openai.com/v1/chat/completions}")
    private String apiUrl;

    public String getAssistantReply(String userMessage, String conversationContext) {
        if (apiKey == null || apiKey.isBlank() || apiKey.startsWith("sk-your")) {
            return "I'm your vehicle breakdown assistant. Please configure a valid OpenAI API key to enable AI responses.";
        }
        try {
            String systemPrompt = "You are a helpful vehicle breakdown assistant. Help with battery, tyre, engine, starting issues. Be brief and practical.";
            Map<String, Object> body = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content", systemPrompt),
                            Map.of("role", "user", "content", conversationContext + "\n\nUser: " + userMessage)
                    ),
                    "max_tokens", 256
            );
            String json = objectMapper.writeValueAsString(body);
            Request request = new Request.Builder()
                    .url(apiUrl)
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .addHeader("Content-Type", "application/json")
                    .post(RequestBody.create(json, JSON))
                    .build();
            try (Response response = client.newCall(request).execute()) {
                if (!response.isSuccessful() || response.body() == null) {
                    return "Sorry, I couldn't process that. Please try again.";
                }
                JsonNode root = objectMapper.readTree(response.body().string());
                JsonNode choices = root.path("choices");
                if (choices.isEmpty()) return "No response.";
                return choices.get(0).path("message").path("content").asText().trim();
            }
        } catch (IOException e) {
            log.warn("OpenAI call failed", e);
            return "I'm having trouble connecting. Please try again.";
        }
    }
}