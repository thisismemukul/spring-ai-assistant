package com.agooddeveloper.spring.ai.assistant.response.diet;

import com.agooddeveloper.spring.ai.assistant.response.NutritionalInformation;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MealSuggestion {
    private String title;
    private List<String> ingredients;
    private String portionSize;
    private NutritionalInformation nutritionalInformation;
    private List<String> instructions;
}
