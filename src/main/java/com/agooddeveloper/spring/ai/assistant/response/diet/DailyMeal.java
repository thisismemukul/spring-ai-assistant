package com.agooddeveloper.spring.ai.assistant.response.diet;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DailyMeal {
    private MealTypes mealTypes;
    private MealSuggestion mealSuggestions;
}
