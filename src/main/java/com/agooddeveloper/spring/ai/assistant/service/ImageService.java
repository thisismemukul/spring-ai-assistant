package com.agooddeveloper.spring.ai.assistant.service;

import com.agooddeveloper.spring.ai.assistant.response.diet.DailyMeal;
import com.agooddeveloper.spring.ai.assistant.response.diet.DietPlanResponse;
import com.agooddeveloper.spring.ai.assistant.response.exercise.DailyWorkoutPlan;
import com.agooddeveloper.spring.ai.assistant.response.exercise.ExercisePlanResponse;
import com.agooddeveloper.spring.ai.assistant.response.exercise.Exercises;
import com.agooddeveloper.spring.ai.assistant.response.image.*;
import com.agooddeveloper.spring.ai.assistant.response.recipe.RecipeResponse;
import com.agooddeveloper.spring.ai.assistant.service.imageservice.IImageService;
import com.agooddeveloper.spring.ai.assistant.utils.LoggerUtil;
import org.springframework.ai.image.ImagePrompt;
import org.springframework.ai.image.ImageResponse;
import org.springframework.ai.stabilityai.StabilityAiImageModel;
import org.springframework.ai.stabilityai.api.StabilityAiImageOptions;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

import static com.agooddeveloper.spring.ai.assistant.utils.AiAssistantUtils.getDefaultImage;
import static com.agooddeveloper.spring.ai.assistant.utils.AiAssistantUtils.limitUpto;

@Service
public class ImageService implements IImageService {

    private final StabilityAiImageModel stabilityAiImageModel;

    public ImageService(StabilityAiImageModel stabilityAiImageModel) {
        this.stabilityAiImageModel = stabilityAiImageModel;
    }

    private static final int IMAGE_DIMENSION = 512;
    private static final int NUMBER_OF_IMAGES = 1;
    private static final int LIMIT_UPTO = 3;
    private static final String STABILITY_AI_MODEL = "stable-diffusion-v1-6";

    @Async
    public CompletableFuture<AiImageResponse> generateRecipeImages(RecipeResponse recipeResponse) {
        LoggerUtil.logInfo("Generating images for recipe Title {} Ingredients {} Instructions " +
                recipeResponse.title(), recipeResponse.ingredients(), recipeResponse.instructions());

        CompletableFuture<TitleImage> titleImageFuture =
                generateTitleImage(recipeResponse.title());

        CompletableFuture<List<IngredientImage>> ingredientImagesFuture =
                generateImagesForList(limitUpto(recipeResponse.ingredients(), LIMIT_UPTO), IngredientImage::new);

        CompletableFuture<List<InstructionImage>> instructionImagesFuture =
                generateImagesForList(limitUpto(recipeResponse.instructions(), LIMIT_UPTO), InstructionImage::new);

        // Combine all futures into a single ImageResponse
        return CompletableFuture.allOf(titleImageFuture, ingredientImagesFuture, instructionImagesFuture)
                .thenApply(v -> new AiImageResponse(
                        titleImageFuture.join(),
                        ingredientImagesFuture.join(),
                        instructionImagesFuture.join(),
                        null
                ))
                .exceptionally(ex -> {
                    throw new RuntimeException("Error generating recipe images: " + ex.getMessage(), ex);
//                    throw new ImageGenerationException("Error generating recipe image: " + ex.getMessage(), ex);
                });
    }

    @Async
    public CompletableFuture<List<TitleImage>> generateDietImages(DietPlanResponse dietPlanResponse) {
        dietPlanResponse.getDailyMealPlan().stream()
                .map(DailyMeal::getMealSuggestions)
                .forEach(mealSuggestion ->
                        LoggerUtil.logInfo("generateDietImages | Diet Meal Title: {}",
                                mealSuggestion.getTitle())
                );

        List<CompletableFuture<TitleImage>> titleImageFutures = dietPlanResponse.getDailyMealPlan().stream()
                .map(dailyMeal -> {
                    String title = dailyMeal.getMealSuggestions().getTitle();
                    LoggerUtil.logInfo("Generating image for meal title: {}", title);
                    return generateTitleImage(title);
                }).toList();

        return CompletableFuture.allOf(titleImageFutures.toArray(new CompletableFuture[0]))
                .thenApply(v -> titleImageFutures.stream()
                        .map(CompletableFuture::join)
                        .collect(Collectors.toList())
                )
                .exceptionally(ex -> {
                    LoggerUtil.logFailure("Error generating diet meal title images: {}", ex.getMessage());
                    return titleImageFutures.stream()
                            .map(future -> new TitleImage("Error generating image", getDefaultImage()))
                            .collect(Collectors.toList());
                });
        //  throw new ImageGenerationException("Error generating recipe image: " + ex.getMessage(), ex);
    }

    @Async
    public CompletableFuture<AiImageResponse> generateExerciseImages(ExercisePlanResponse exercisePlanResponse) {
        LoggerUtil.logInfo("Generating images for Fitness Goal: {}", exercisePlanResponse.getFitnessGoal());
        exercisePlanResponse.getDailyWorkoutPlan().forEach(dailyWorkoutPlan ->
                dailyWorkoutPlan.getExercise().forEach(exercise ->
                        LoggerUtil.logInfo("Exercise: Title: {}",
                                exercise.getTitle())
                )
        );

        CompletableFuture<TitleImage> titleImageFuture =
                generateTitleImage(exercisePlanResponse.getFitnessGoal());

        List<CompletableFuture<ExerciseImage>> exerciseImageFutures = exercisePlanResponse.getDailyWorkoutPlan().stream()
                .flatMap(dailyWorkoutPlan -> dailyWorkoutPlan.getExercise().stream())
                .map(exercise -> {
                    LoggerUtil.logInfo("Generating image for exercise: {}", exercise.getTitle());
                    return generateExerciseImage(exercise.getTitle());
                }).toList();

        return CompletableFuture.allOf(titleImageFuture, CompletableFuture.allOf(exerciseImageFutures.toArray(new CompletableFuture[0])))
                .thenApply(v -> new AiImageResponse(
                        titleImageFuture.join(),
                        null,
                        null,
                        exerciseImageFutures.stream()
                                .map(CompletableFuture::join)
                                .collect(Collectors.toList())
                ))
                .exceptionally(ex -> {
                    LoggerUtil.logFailure("Error generating exercise images: {}", ex.getMessage());
                    return new AiImageResponse(
                            new TitleImage("Error generating fitness goal image", getDefaultImage()),
                            null,
                            null,
                            exerciseImageFutures.stream()
                                    .map(future -> new ExerciseImage("Error generating image", getDefaultImage()))
                                    .collect(Collectors.toList())
                    );
                });
    }

    private CompletableFuture<ExerciseImage> generateExerciseImage(String exerciseTitle) {
        return generateImage(exerciseTitle)
                .thenApply(imageData -> new ExerciseImage(exerciseTitle, imageData))
                .exceptionally(ex -> new ExerciseImage(exerciseTitle, getDefaultImage()));
    }

    private CompletableFuture<TitleImage> generateTitleImage(String title) {
        return generateImage(title)
                .thenApply(imageData -> new TitleImage(title, imageData))
                .exceptionally(ex -> new TitleImage(title, getDefaultImage()));
    }

    private <T> CompletableFuture<List<T>> generateImagesForList(List<String> items, BiFunction<String, byte[], T> imageMapper) {
        List<CompletableFuture<T>> futures = items.stream()
                .map(item -> generateImage(item).thenApply(imageData -> imageMapper.apply(item, imageData)))
                .toList();

        return CompletableFuture.supplyAsync(() -> futures.stream()
                .map(CompletableFuture::join)
                .collect(Collectors.toList())
        );
    }

    private CompletableFuture<byte[]> generateImage(String prompt) {
        if (prompt == null || prompt.isEmpty()) {
            return CompletableFuture.completedFuture(getDefaultImage());
        }

        return CompletableFuture.supplyAsync(() -> {
            ImagePrompt imagePrompt = new ImagePrompt(prompt,
                    StabilityAiImageOptions.builder()
                            .withModel(STABILITY_AI_MODEL)
                            .withN(NUMBER_OF_IMAGES)
                            .withHeight(IMAGE_DIMENSION)
                            .withWidth(IMAGE_DIMENSION)
                            .build());

            ImageResponse response = stabilityAiImageModel.call(imagePrompt);
            LoggerUtil.logInfo("generateMultipleImagesWithStabilityAi | response : " + response);
            return Base64.getDecoder().decode(response.getResults().get(0).getOutput().getB64Json());
        }).exceptionally(ex -> {
            LoggerUtil.logFailure("Error generating image for '" + prompt + "': " + ex.getMessage());
            throw new RuntimeException("Image generation failed for prompt: " + prompt, ex);
//            throw new ImageGenerationException("Image generation failed for prompt: " + prompt, ex);
        });
    }
}