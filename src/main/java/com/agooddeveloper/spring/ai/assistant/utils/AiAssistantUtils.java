package com.agooddeveloper.spring.ai.assistant.utils;

import com.agooddeveloper.spring.ai.assistant.enums.ResponseCode;
import com.agooddeveloper.spring.ai.assistant.exceptions.DefaultBaseError;
import com.agooddeveloper.spring.ai.assistant.exceptions.ValidationException;
import org.apache.commons.lang3.StringUtils;
import reactor.core.publisher.Mono;

import static com.agooddeveloper.spring.ai.assistant.enums.ResponseCode.*;


public class AiAssistantUtils {

    public static Mono<String> validateChatInputs(String prompt, String model) {
        if (StringUtils.isBlank(prompt)) {
            return Mono.error(createValidationException(PROMPT_IS_EMPTY));
        }
        return validateModel(model);
    }

    public static Mono<String> validateChatInputs(String param1, String param2, String param3, String model) {
        if (StringUtils.isBlank(param1) || StringUtils.isBlank(param2) || StringUtils.isBlank(param3)) {
            throw new ValidationException(
                    new DefaultBaseError<>(
                            INPUT_IS_INVALID.code(),
                            INPUT_IS_INVALID.message(),
                            INPUT_IS_INVALID.userMessage(),
                            true)
            );
        }
        return validateModel(model);
    }

    private static Mono<String> validateModel(String model) {
        if (StringUtils.isBlank(model)) {
            return Mono.error(createValidationException(MODEL_IS_INVALID));
        }
        return Mono.just(model.toLowerCase());
    }

    public static ValidationException createValidationException(ResponseCode code) {
        return new ValidationException(
                new DefaultBaseError<>(
                        code.code(),
                        code.message(),
                        code.userMessage()
                )
        );
    }
    public static String getRecipeTemplate() {
        return """
                Create a recipe based on the following details:
                Ingredients: {ingredients}
                Cuisine: {cuisine}
                Dietary Restrictions: {dietaryRestrictions}
                {format}
                """;
    }
    public static String getDietTemplate() {
        return """
                Create a diet plan based on the following details:
                DietGoal: {dietGoal}
                FoodPreferences: {foodPreferences}
                Dietary Restrictions: {dietaryRestrictions}
                For the following Meal Types: {mealTypes}
                - Breakfast
                - Mid-Morning Snack
                - Lunch
                - Afternoon Snack
                - Dinner
                {format}
                """;
    }
    public static String getExerciseTemplate() {
        return """
                Create a exercise plan based on the following details:
                FitnessGoal: {fitnessGoal}
                ExercisePreference: {exercisePreference}
                Equipment: {equipment}
                {format}
                """;
    }
}
