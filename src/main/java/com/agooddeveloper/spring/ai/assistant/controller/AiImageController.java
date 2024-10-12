package com.agooddeveloper.spring.ai.assistant.controller;

import com.agooddeveloper.spring.ai.assistant.annotations.Validated;
import com.agooddeveloper.spring.ai.assistant.response.ApiResponse;
import com.agooddeveloper.spring.ai.assistant.response.diet.DietPlanResponse;
import com.agooddeveloper.spring.ai.assistant.response.exercise.ExercisePlanResponse;
import com.agooddeveloper.spring.ai.assistant.response.image.AiImageResponse;
import com.agooddeveloper.spring.ai.assistant.response.image.TitleImage;
import com.agooddeveloper.spring.ai.assistant.response.recipe.RecipeResponse;
import com.agooddeveloper.spring.ai.assistant.service.ImageService;
import com.agooddeveloper.spring.ai.assistant.utils.AiAssistantUtils;
import com.agooddeveloper.spring.ai.assistant.validators.image.DietPlanRequestValidator;
import com.agooddeveloper.spring.ai.assistant.validators.image.ExerciseRequestValidator;
import com.agooddeveloper.spring.ai.assistant.validators.image.RecipeRequestValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.concurrent.CompletableFuture;

import static com.agooddeveloper.spring.ai.assistant.constants.RESTUriConstants.*;
import static com.agooddeveloper.spring.ai.assistant.utils.AiAssistantUtils.successResponse;

@RestController
@RequestMapping(value = ASK_AI)
public class AiImageController {

    private final ImageService imageService;

    @Autowired
    public AiImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping(RECIPE_IMAGES)
    @Validated(validatorClasses = {RecipeRequestValidator.class})
    public Mono<ResponseEntity<ApiResponse<AiImageResponse>>> generateRecipeImages(@RequestBody RecipeResponse recipeResponse) {
        CompletableFuture<AiImageResponse> imageResponseFuture = imageService.generateRecipeImages(recipeResponse);
        return Mono.fromFuture(imageResponseFuture)
                .flatMap(result -> successResponse("Recipe Images Created successfully", HttpStatus.OK, result))
                .onErrorResume(AiAssistantUtils::errorResponse);
    }

    @PostMapping(DIET_IMAGES)
    @Validated(validatorClasses = {DietPlanRequestValidator.class})
    public Mono<ResponseEntity<ApiResponse<List<TitleImage>>>> generateDietImages(@RequestBody DietPlanResponse dietPlanResponse) {
        CompletableFuture<List<TitleImage>> imageResponseFuture = imageService.generateDietImages(dietPlanResponse);
        return Mono.fromFuture(imageResponseFuture)
                .flatMap(result -> successResponse("Diet Images Created successfully", HttpStatus.OK, result))
                .onErrorResume(AiAssistantUtils::errorResponse);
    }

    @PostMapping(EXERCISE_IMAGES)
    @Validated(validatorClasses = {ExerciseRequestValidator.class})
    public Mono<ResponseEntity<ApiResponse<AiImageResponse>>> generateExerciseImages(@RequestBody ExercisePlanResponse exercisePlanResponse) {
        CompletableFuture<AiImageResponse> imageResponseFuture = imageService.generateExerciseImages(exercisePlanResponse);
        return Mono.fromFuture(imageResponseFuture)
                .flatMap(result -> successResponse("Exercise Images Created successfully", HttpStatus.OK, result))
                .onErrorResume(AiAssistantUtils::errorResponse);
    }
}






