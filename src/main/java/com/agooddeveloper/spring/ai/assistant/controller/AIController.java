package com.agooddeveloper.spring.ai.assistant.controller;

import com.agooddeveloper.spring.ai.assistant.response.ApiResponse;
import com.agooddeveloper.spring.ai.assistant.response.diet.DietPlanResponse;
import com.agooddeveloper.spring.ai.assistant.response.exercise.ExercisePlanResponse;
import com.agooddeveloper.spring.ai.assistant.response.recipe.RecipeResponse;
import com.agooddeveloper.spring.ai.assistant.service.chatservice.impl.ChatService;
import com.agooddeveloper.spring.ai.assistant.service.trainerservice.impl.DietPlannerService;
import com.agooddeveloper.spring.ai.assistant.service.trainerservice.impl.ExercisePlannerService;
import com.agooddeveloper.spring.ai.assistant.service.trainerservice.impl.RecipeService;
import com.agooddeveloper.spring.ai.assistant.utils.AiAssistantUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import static com.agooddeveloper.spring.ai.assistant.constants.RESTUriConstants.*;
import static com.agooddeveloper.spring.ai.assistant.utils.AiAssistantUtils.successResponse;

@RestController
@RequestMapping(value = ASK_AI)
public class AIController {

    private final ChatService chatService;
    private final RecipeService recipeService;
    private final DietPlannerService dietPlannerService;
    private final ExercisePlannerService exercisePlannerService;

    @Autowired
    public AIController(ChatService chatService,
                        RecipeService recipeService,
                        DietPlannerService dietPlannerService,
                        ExercisePlannerService exercisePlannerService) {
        this.chatService = chatService;
        this.recipeService = recipeService;
        this.dietPlannerService = dietPlannerService;
        this.exercisePlannerService = exercisePlannerService;
    }



    @GetMapping(CHAT)
    public Mono<ResponseEntity<ApiResponse<String>>> getChatResponse(@RequestParam String prompt, @RequestParam String model) {
        return chatService.getResponse(prompt, model)
                .flatMap(result -> successResponse("Created successfully", HttpStatus.OK, result))
                .onErrorResume(AiAssistantUtils::errorResponse);
    }

    @GetMapping(CREATE_RECIPE)
    public Mono<ResponseEntity<ApiResponse<RecipeResponse>>> createRecipe(@RequestParam String ingredients,
                                                                          @RequestParam(defaultValue = "any") String cuisine,
                                                                          @RequestParam(defaultValue = "") String dietaryRestrictions,
                                                                          @RequestParam String model) {
        return recipeService.createPlan(ingredients, cuisine, dietaryRestrictions, model,RecipeResponse.class)
                .flatMap(result -> successResponse("Recipe Created successfully", HttpStatus.OK, result))
                .onErrorResume(AiAssistantUtils::errorResponse);
    }

    @GetMapping(DIET_PLAN)
    public Mono<ResponseEntity<ApiResponse<DietPlanResponse>>> createDietPlan(@RequestParam String dietGoal,
                                                                              @RequestParam(defaultValue = "any") String foodPreferences,
                                                                              @RequestParam(defaultValue = "") String dietaryRestrictions,
                                                                              @RequestParam String model) {
        return dietPlannerService.createPlan(dietGoal, foodPreferences, dietaryRestrictions, model,DietPlanResponse.class)
                .flatMap(result -> successResponse("Diet Plan Created successfully", HttpStatus.OK, result))
                .onErrorResume(AiAssistantUtils::errorResponse);
    }


    @GetMapping(EXERCISE_PLAN)
    public Mono<ResponseEntity<ApiResponse<ExercisePlanResponse>>> createExercisePlan(@RequestParam String fitnessGoal,
                                                                                      @RequestParam(defaultValue = "any") String exercisePreference,
                                                                                      @RequestParam(defaultValue = "") String equipment,
                                                                                      @RequestParam String model) {
        return exercisePlannerService.createPlan(fitnessGoal, exercisePreference, equipment, model,ExercisePlanResponse.class)
                .flatMap(result -> successResponse("Exercise Plan Created successfully", HttpStatus.OK, result))
                .onErrorResume(AiAssistantUtils::errorResponse);
    }


}
