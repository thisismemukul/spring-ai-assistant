package com.agooddeveloper.spring.ai.assistant.response.diet;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public record DietPlanResponse(
        String dietGoal,
        String foodPreferences,
        String dietaryRestrictions,
        String weeklySchedule,
        List<DailyMeal> dailyMealPlan
) {
}

