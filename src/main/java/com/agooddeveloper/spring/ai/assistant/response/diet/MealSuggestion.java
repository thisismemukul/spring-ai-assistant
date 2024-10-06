package com.agooddeveloper.spring.ai.assistant.response.diet;

import com.agooddeveloper.spring.ai.assistant.response.NutritionalInformation;

import java.util.List;

public record MealSuggestion(
        String title,
        List<String> ingredients,
        String portionSize,
        NutritionalInformation nutritionalInformation,
        List<String> instructions
) {
}
