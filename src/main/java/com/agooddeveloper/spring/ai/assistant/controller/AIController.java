package com.agooddeveloper.spring.ai.assistant.controller;

import com.agooddeveloper.spring.ai.assistant.response.ApiResponse;
import com.agooddeveloper.spring.ai.assistant.response.recipe.RecipeResponse;
import com.agooddeveloper.spring.ai.assistant.service.chatservice.impl.ChatService;
import com.agooddeveloper.spring.ai.assistant.service.trainerservice.impl.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import static com.agooddeveloper.spring.ai.assistant.constants.RESTUriConstants.*;

@RestController
@RequestMapping(value = ASK_AI)
public class AIController {

    private final ChatService chatService;
    private final RecipeService recipeService;

    @Autowired
    public AIController(ChatService chatService, RecipeService recipeService) {
        this.chatService = chatService;
        this.recipeService = recipeService;
    }



    @GetMapping(CHAT)
    public Mono<ResponseEntity<ApiResponse<String>>> getChatResponse(@RequestParam String prompt, @RequestParam String model) {
        return chatService.getResponse(prompt, model)
                .flatMap(result -> successResponse("Created successfully", HttpStatus.OK, result))
                .onErrorResume(this::errorResponse);
    }

    @GetMapping(CREATE_RECIPE)
    public Mono<ResponseEntity<ApiResponse<RecipeResponse>>> createRecipe(@RequestParam String ingredients,
                                                                          @RequestParam(defaultValue = "any") String cuisine,
                                                                          @RequestParam(defaultValue = "") String dietaryRestrictions,
                                                                          @RequestParam String model) {
        return recipeService.createPlan(ingredients, cuisine, dietaryRestrictions, model)
                .flatMap(result -> successResponse("Recipe Created successfully", HttpStatus.OK, result))
                .onErrorResume(this::errorResponse);
    }

    private <T> Mono<ResponseEntity<ApiResponse<T>>> successResponse(String message, HttpStatus status, T data) {
        return Mono.just(ResponseEntity.ok(new ApiResponse<>(message, status.value(), data)));
    }

    private <T> Mono<ResponseEntity<ApiResponse<T>>> errorResponse(Throwable e) {
        return Mono.error(e);
    }

}
