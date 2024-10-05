package com.agooddeveloper.spring.ai.assistant.controller;

import com.agooddeveloper.spring.ai.assistant.response.ApiResponse;
import com.agooddeveloper.spring.ai.assistant.service.chatservice.impl.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import static com.agooddeveloper.spring.ai.assistant.constants.Constants.AI_HEALTH_CHECK;
import static com.agooddeveloper.spring.ai.assistant.constants.RESTUriConstants.*;

@RestController
@RequestMapping(value = ASK_AI)
public class AIController {

    private final ChatService chatService;

    @Autowired
    public AIController(ChatService chatService) {
        this.chatService = chatService;
    }


    @GetMapping(CHAT)
    public Mono<ResponseEntity<ApiResponse<String>>> getChatResponse(@RequestParam String prompt) {
        return chatService.getResponse(prompt)
                .flatMap(result -> successResponse("Created successfully", HttpStatus.OK, result))
                .onErrorResume(this::errorResponse);
    }

    private <T> Mono<ResponseEntity<ApiResponse<T>>> successResponse(String message, HttpStatus status, T data) {
        return Mono.just(ResponseEntity.ok(new ApiResponse<>(message, status.value(), data)));
    }

    private <T> Mono<ResponseEntity<ApiResponse<T>>> errorResponse(Throwable e) {
        return Mono.just(ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ApiResponse<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value(), null)));
    }

}
