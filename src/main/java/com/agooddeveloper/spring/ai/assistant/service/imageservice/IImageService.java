package com.agooddeveloper.spring.ai.assistant.service.imageservice;

import com.agooddeveloper.spring.ai.assistant.response.diet.DietPlanResponse;
import com.agooddeveloper.spring.ai.assistant.response.image.AiImageResponse;
import com.agooddeveloper.spring.ai.assistant.response.image.TitleImage;
import com.agooddeveloper.spring.ai.assistant.response.recipe.RecipeResponse;

import java.util.List;
import java.util.concurrent.CompletableFuture;

public interface IImageService {
    CompletableFuture<AiImageResponse> generateRecipeImages(RecipeResponse recipeResponse);
    CompletableFuture<List<TitleImage>> generateDietImages(DietPlanResponse dietPlanResponse);
}
