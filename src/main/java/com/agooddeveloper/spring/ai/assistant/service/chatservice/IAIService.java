package com.agooddeveloper.spring.ai.assistant.service.chatservice;


import reactor.core.publisher.Mono;

public interface IAIService {
    Mono<String> getResponse(String prompt, String model);
}
