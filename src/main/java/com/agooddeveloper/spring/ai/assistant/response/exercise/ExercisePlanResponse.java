package com.agooddeveloper.spring.ai.assistant.response.exercise;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ExercisePlanResponse{

    private String fitnessGoal;
    private String exercisePreference;
    private String equipment;
    private String weeklySchedule;
    private List<DailyWorkoutPlan> dailyWorkoutPlan;
    private String progressionTips;
    private String approximateFatBurned;
    private String muscleGained;
    private String activeRecovery;
    private String finalNote;
}
