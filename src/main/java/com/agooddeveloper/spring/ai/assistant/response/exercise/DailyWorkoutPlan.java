package com.agooddeveloper.spring.ai.assistant.response.exercise;

import java.util.List;

public record DailyWorkoutPlan(
        String bodyPart,
        List<Exercises> exercise
) {}
