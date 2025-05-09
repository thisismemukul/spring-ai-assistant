package com.agooddeveloper.spring.ai.assistant.response.diet;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyMeal {
    private MealTypes mealTypes;
    private MealSuggestion mealSuggestions;
}
