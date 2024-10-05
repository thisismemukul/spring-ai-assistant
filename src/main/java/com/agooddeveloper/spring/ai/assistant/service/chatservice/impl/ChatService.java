package com.agooddeveloper.spring.ai.assistant.service.chatservice.impl;

import com.agooddeveloper.spring.ai.assistant.exceptions.DefaultBaseError;
import com.agooddeveloper.spring.ai.assistant.exceptions.ValidationException;
import com.agooddeveloper.spring.ai.assistant.service.chatservice.IAIService;
import lombok.Data;
import org.apache.commons.lang3.StringUtils;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import static com.agooddeveloper.spring.ai.assistant.constants.Constants.AI_MODEL;
import static com.agooddeveloper.spring.ai.assistant.enums.ResponseCode.PROMPT_IS_EMPTY;

@Data
@Service
public class ChatService implements IAIService {

    private final ChatModel openAiChatModel;

    @Autowired
    public ChatService(ChatModel openAiChatModel) {
        this.openAiChatModel = openAiChatModel;
    }


    @Override
    public Mono<String> getResponse(String prompt) {
        if (StringUtils.isBlank(prompt)) {
            return Mono.error(
                    new ValidationException(
                            new DefaultBaseError<>(
                                    PROMPT_IS_EMPTY.code(),
                                    PROMPT_IS_EMPTY.message(),
                                    PROMPT_IS_EMPTY.userMessage())
                    ));
        }
        return Mono.fromCallable(() -> {
            ChatResponse response = openAiChatModel.call(
                    new Prompt(
                            prompt,
                            OpenAiChatOptions.builder()
                                    .withModel(AI_MODEL)
                                    .withTemperature(0.4F)
                                    .build()
                    ));
            return response.getResult().getOutput().getContent();
        });
    }
}
