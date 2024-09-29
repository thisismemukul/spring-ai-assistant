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
import reactor.core.publisher.Flux;

@Data
@Service
public class ChatService implements IAIService {

    private final ChatModel openAiChatModel;

    @Autowired
    public ChatService(ChatModel openAiChatModel) {
        this.openAiChatModel = openAiChatModel;
    }


    @Override
    public Flux<String> getResponse(String prompt) {
        if (StringUtils.isBlank(prompt)) {
            return Flux.error(
                    new ValidationException(
                            new DefaultBaseError<>(
                                    "AI-4001",
                                    "Prompt is empty",
                                    "Ugh !! seams like you forgot to say something")
                    ));
        }
        ChatResponse response = openAiChatModel.call(
                new Prompt(
                        prompt,
                        OpenAiChatOptions.builder()
                                .withModel("mixtral-8x7b-32768")
                                .withTemperature(0.4F)
                                .build()
                ));
        return Flux.just(response.getResult().getOutput().getContent());
    }
}
