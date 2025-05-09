package com.agooddeveloper.spring.ai.assistant.response.diet;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DietPlanResponse {
    private String dietGoal;
    private String foodPreferences;
    private String dietaryRestrictions;
    private String weeklySchedule;
    private List<DailyMeal> dailyMealPlan;
}