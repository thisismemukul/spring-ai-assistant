package com.agooddeveloper.spring.ai.assistant.configuration;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;

public class OpenAiChatModel implements ChatModel {
    @Override
    public ChatResponse call(Prompt prompt) {
        // Implementation for OpenAI model
        return null;
    }

    @Override
    public ChatOptions getDefaultOptions() {
        // Return default options for OpenAI model
        return null;
    }
}
