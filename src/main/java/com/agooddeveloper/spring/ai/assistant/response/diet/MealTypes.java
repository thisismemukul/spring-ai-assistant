package com.agooddeveloper.spring.ai.assistant.response.diet;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum MealTypes {
    BREAKFAST("Breakfast"),
    MID_MORNING_SNACK("Mid-Morning Snack"),
    LUNCH("Lunch"),
    AFTERNOON_SNACK("Afternoon Snack"),
    DINNER("Dinner");
    private final String value;
}
