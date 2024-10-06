package com.agooddeveloper.spring.ai.assistant.response.exercise;

import java.util.List;

public record ExercisePlanResponse(
        String fitnessGoal,
        String exercisePreference,
        String equipment,
        String weeklySchedule,
        List<DailyWorkoutPlan> dailyWorkoutPlan,
        String progressionTips,
        String approximateFatBurned,
        String muscleGained,
        String activeRecovery,
        String finalNotes
) {}
