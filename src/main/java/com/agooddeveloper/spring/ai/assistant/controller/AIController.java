package com.agooddeveloper.spring.ai.assistant.controller;

import com.agooddeveloper.spring.ai.assistant.service.chatservice.impl.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Flux;

@RestController
public class AIController {

    private final ChatService chatService;

    @Autowired
    public AIController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/health")
    public String health() {
        return "I am healthy";
    }

    @GetMapping("/chat")
    public Flux<String> getChatResponse(@RequestParam String prompt) {
        return chatService.getResponse(prompt);
    }

}
