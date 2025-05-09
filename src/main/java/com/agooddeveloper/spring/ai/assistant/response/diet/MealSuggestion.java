package com.agooddeveloper.spring.ai.assistant.response.diet;

import com.agooddeveloper.spring.ai.assistant.response.NutritionalInformation;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class MealSuggestion {
    private String title;
    private List<String> ingredients;
    private String portionSize;
    private NutritionalInformation nutritionalInformation;
    private List<String> instructions;
}
