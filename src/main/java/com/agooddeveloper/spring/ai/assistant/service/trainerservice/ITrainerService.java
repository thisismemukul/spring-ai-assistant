package com.agooddeveloper.spring.ai.assistant.service.trainerservice;

import com.agooddeveloper.spring.ai.assistant.response.recipe.RecipeResponse;
import reactor.core.publisher.Mono;

public interface ITrainerService {
    Mono<RecipeResponse> createPlan(String prompt, String prompt1, String prompt2, String model);
}
