package com.agooddeveloper.spring.ai.assistant.response.diet;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class DietPlanResponse {
    private String dietGoal;
    private String foodPreferences;
    private String dietaryRestrictions;
    private String weeklySchedule;
    private List<DailyMeal> dailyMealPlan;
}