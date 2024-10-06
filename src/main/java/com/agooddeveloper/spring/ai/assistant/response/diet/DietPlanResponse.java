package com.agooddeveloper.spring.ai.assistant.response.diet;

import java.util.List;

public record DietPlanResponse(
        String dietGoal,
        String foodPreferences,
        String dietaryRestrictions,
        String weeklySchedule,
        List<DailyMeal> dailyMealPlan
) {
}

