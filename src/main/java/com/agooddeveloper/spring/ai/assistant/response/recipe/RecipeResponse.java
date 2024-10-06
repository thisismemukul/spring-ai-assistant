package com.agooddeveloper.spring.ai.assistant.response.recipe;

import com.agooddeveloper.spring.ai.assistant.response.NutritionalInformation;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public record RecipeResponse(
        String title,
        List<String> ingredients,
        List<String> instructions,
        NutritionalInformation nutritionalInformation
) {}