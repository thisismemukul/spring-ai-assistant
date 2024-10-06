package com.agooddeveloper.spring.ai.assistant.response.recipe;

public record NutritionalInformation(
        String calories,
        String totalFat,
        String saturatedFat,
        String polyunsaturatedFat,
        String monounsaturatedFat,
        String transFat,
        String cholesterol,
        String sodium,
        String potassium,
        String totalCarbohydrates,
        String dietaryFiber,
        String sugars,
        String protein,
        String vitaminA,
        String vitaminC,
        String calcium
) {}
