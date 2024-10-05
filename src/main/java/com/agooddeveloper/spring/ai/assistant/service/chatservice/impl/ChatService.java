package com.agooddeveloper.spring.ai.assistant.service.chatservice.impl;

import com.agooddeveloper.spring.ai.assistant.service.chatservice.IAIService;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.ollama.api.OllamaModel;
import org.springframework.ai.ollama.api.OllamaOptions;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import static com.agooddeveloper.spring.ai.assistant.constants.Constants.*;
import static com.agooddeveloper.spring.ai.assistant.enums.ResponseCode.MODEL_IS_INVALID;
import static com.agooddeveloper.spring.ai.assistant.utils.AiAssistantUtils.createValidationException;
import static com.agooddeveloper.spring.ai.assistant.utils.AiAssistantUtils.validateInputs;

@Slf4j
@Data
@Service
public class ChatService implements IAIService {

    private final ChatModel openAiChatModel;
    private final ChatModel ollamaChatModel;

    @Autowired
    public ChatService(ChatModel openAiChatModel, ChatModel ollamaChatModel) {
        this.openAiChatModel = openAiChatModel;
        this.ollamaChatModel = ollamaChatModel;
    }


    @Override
    public Mono<String> getResponse(String prompt, String model) {
        return validateInputs(prompt, model)
                .flatMap(validModel -> {
                    switch (validModel) {
                        case OPEN_AI -> {
                            return openAIChat(prompt, openAiChatModel);
                        }
                        case O_LLAMA_AI -> {
                            return ollamaChat(prompt, ollamaChatModel);
                        }
                        default -> {
                            return Mono.error(createValidationException(MODEL_IS_INVALID));
                        }
                    }
                });
    }


    private Mono<String> openAIChat(String prompt, ChatModel model) {
        return Mono.fromCallable(() -> {
            try {
                ChatResponse response = model.call(
                        new Prompt(
                                prompt,
                                OpenAiChatOptions.builder()
                                        .withModel(AI_MODEL)
                                        .withTemperature(0.4F)
                                        .build()
                        ));
                return response.getResult().getOutput().getContent();
            } catch (Exception e) {
                log.error("Error occurred while processing chat prompt: '{}'", prompt, e);
                throw new RuntimeException(e.getMessage(), e);
            }
        });
    }


    private Mono<String> ollamaChat(String prompt, ChatModel model) {
        return Mono.fromCallable(() -> {
            try {
                ChatResponse response = model.call(
                        new Prompt(
                                prompt,
                                OllamaOptions.builder()
                                        .withModel(OllamaModel.MISTRAL) // LLAMA3_1
                                        .withTemperature(0.4F)
                                        .build()
                        ));
                return response.getResult().getOutput().getContent();
            } catch (Exception e) {
                log.error("Error occurred while processing chat prompt: '{}'", prompt, e);
                throw new RuntimeException(e.getMessage(), e);
            }
        });
    }
}
