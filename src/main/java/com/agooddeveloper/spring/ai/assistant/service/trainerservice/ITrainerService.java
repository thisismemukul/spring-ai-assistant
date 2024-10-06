package com.agooddeveloper.spring.ai.assistant.service.trainerservice;

import com.agooddeveloper.spring.ai.assistant.response.diet.DietPlanResponse;
import com.agooddeveloper.spring.ai.assistant.response.recipe.RecipeResponse;
import reactor.core.publisher.Mono;

public interface ITrainerService {
    <T> Mono<T> createPlan(String param1, String param2, String param3, String model, Class<T> responseType);
}
