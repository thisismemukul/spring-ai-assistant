package com.agooddeveloper.spring.ai.assistant.response.diet;

import com.agooddeveloper.spring.ai.assistant.response.NutritionalInformation;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public record MealSuggestion(
        String title,
        List<String> ingredients,
        String portionSize,
        NutritionalInformation nutritionalInformation,
        List<String> instructions
) {
}
