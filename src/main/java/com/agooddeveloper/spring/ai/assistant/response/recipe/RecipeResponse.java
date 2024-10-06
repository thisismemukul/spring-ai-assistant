package com.agooddeveloper.spring.ai.assistant.response.recipe;

import com.agooddeveloper.spring.ai.assistant.response.NutritionalInformation;

import java.util.List;

public record RecipeResponse(
        String title,
        List<String> ingredients,
        List<String> instructions,
        NutritionalInformation nutritionalInformation
) {}