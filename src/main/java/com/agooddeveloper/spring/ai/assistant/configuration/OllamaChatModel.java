package com.agooddeveloper.spring.ai.assistant.configuration;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;

public class OllamaChatModel implements ChatModel {
    @Override
    public ChatResponse call(Prompt prompt) {
        // Implementation for OLlama model
        return null;
    }

    @Override
    public ChatOptions getDefaultOptions() {
        // Return default options for OLlama model
        return null;
    }
}
