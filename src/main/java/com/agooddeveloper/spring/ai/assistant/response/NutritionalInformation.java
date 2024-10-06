package com.agooddeveloper.spring.ai.assistant.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
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
