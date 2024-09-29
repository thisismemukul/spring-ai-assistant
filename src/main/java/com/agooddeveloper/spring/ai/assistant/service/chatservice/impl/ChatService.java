package com.agooddeveloper.spring.ai.assistant.service.chatservice.impl;

import com.agooddeveloper.spring.ai.assistant.service.chatservice.IAIService;
import lombok.Data;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Data
@Service
public class ChatService implements IAIService {

    private final ChatModel openAiChatModel;

    @Autowired
    public ChatService(ChatModel openAiChatModel) {
        this.openAiChatModel = openAiChatModel;
    }


    @Override
    public String getResponse(String prompt) {
        ChatResponse response = openAiChatModel.call(
                new Prompt(
                        prompt,
                        OpenAiChatOptions.builder()
                                .withModel("mixtral-8x7b-32768")
                                .withTemperature(0.4F)
                                .build()
                ));
        System.out.println(response);
        return "I will return AI response.";
    }
}
