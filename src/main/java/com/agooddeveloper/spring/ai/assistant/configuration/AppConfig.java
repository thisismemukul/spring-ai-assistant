package com.agooddeveloper.spring.ai.assistant.configuration;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class AppConfig {

    @Bean
    @Primary
    public ChatModel openAiChatModel() {
        return new OpenAiChatModel();
    }

    @Bean(name = "springAiOLlamaChatModel")
    public ChatModel ollamaChatModel() {
        return new OllamaChatModel();
    }
}
