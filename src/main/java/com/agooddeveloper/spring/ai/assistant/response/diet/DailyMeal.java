package com.agooddeveloper.spring.ai.assistant.response.diet;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public record DailyMeal(
        MealType mealType,
        MealSuggestion mealSuggestions
) {
}
