package com.agooddeveloper.spring.ai.assistant.validators.image;

import com.agooddeveloper.spring.ai.assistant.annotations.IValidator;
import com.agooddeveloper.spring.ai.assistant.exceptions.DefaultBaseError;
import com.agooddeveloper.spring.ai.assistant.exceptions.ValidationException;
import com.agooddeveloper.spring.ai.assistant.response.diet.DailyMeal;
import com.agooddeveloper.spring.ai.assistant.response.diet.DietPlanResponse;
import com.agooddeveloper.spring.ai.assistant.utils.LoggerUtil;
import com.agooddeveloper.spring.ai.assistant.validators.FieldParam;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.agooddeveloper.spring.ai.assistant.enums.ResponseCode.DIET_INPUT_IS_INVALID;

@Component
public class DietPlanRequestValidator implements IValidator {

    @Override
    public <T> boolean validate(T request, HttpServletRequest httpServletRequest, List<FieldParam> fieldParams) throws IllegalAccessException {
        LoggerUtil.logInfo("Inside DietPlanResponseValidator");

        if (!(request instanceof DietPlanResponse dietPlanResponse)) {
            throw new IllegalArgumentException("Invalid request type");
        }

        boolean isValid = true;

        if (ObjectUtils.isEmpty(dietPlanResponse.getDietGoal())) {
            LoggerUtil.logInfo("Diet goal is required.");
            isValid = false;
        }

        if (ObjectUtils.isEmpty(dietPlanResponse.getFoodPreferences())) {
            LoggerUtil.logInfo("Food preferences are required.");
            isValid = false;
        }

        if (ObjectUtils.isEmpty(dietPlanResponse.getDietaryRestrictions())) {
            LoggerUtil.logInfo("Dietary restrictions are required.");
            isValid = false;
        }

        if (ObjectUtils.isEmpty(dietPlanResponse.getWeeklySchedule())) {
            LoggerUtil.logInfo("Weekly schedule is required.");
            isValid = false;
        }

        if (ObjectUtils.isEmpty(dietPlanResponse.getDailyMealPlan())) {
            LoggerUtil.logInfo("Daily meal plan is required.");
            isValid = false;
        } else {
            for (DailyMeal dailyMeal : dietPlanResponse.getDailyMealPlan()) {
                if (ObjectUtils.isEmpty(dailyMeal.getMealSuggestions())) {
                    LoggerUtil.logInfo("Meal suggestions are required for one or more daily meals.");
                    isValid = false;
                    continue;
                }

                String title = dailyMeal.getMealSuggestions().getTitle();
                if (ObjectUtils.isEmpty(title)) {
                    LoggerUtil.logInfo("Title is required for meal suggestions.");
                    isValid = false;
                }

                List<String> ingredients = dailyMeal.getMealSuggestions().getIngredients();
                if (ObjectUtils.isEmpty(ingredients)) {
                    LoggerUtil.logInfo("Ingredients are required for meal suggestions.");
                    isValid = false;
                }

                List<String> instructions = dailyMeal.getMealSuggestions().getInstructions();
                if (ObjectUtils.isEmpty(instructions)) {
                    LoggerUtil.logInfo("Instructions are required for meal suggestions.");
                    isValid = false;
                }
            }
        }

        if (!isValid) {
            LoggerUtil.logFailure("Diet goal is not valid.");
            throw new ValidationException(
                    new DefaultBaseError<>(
                            DIET_INPUT_IS_INVALID.code(),
                            DIET_INPUT_IS_INVALID.message(),
                            DIET_INPUT_IS_INVALID.userMessage(),
                            true)
            );
        }

        return isValid;
    }
}
