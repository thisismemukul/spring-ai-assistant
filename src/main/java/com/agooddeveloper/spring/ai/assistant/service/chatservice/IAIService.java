package com.agooddeveloper.spring.ai.assistant.service.chatservice;

import reactor.core.publisher.Flux;

public interface IAIService {
    Flux<String> getResponse(String prompt);
}
