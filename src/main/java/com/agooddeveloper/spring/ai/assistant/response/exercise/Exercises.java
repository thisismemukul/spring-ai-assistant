package com.agooddeveloper.spring.ai.assistant.response.exercise;

public record Exercises(
        String title,
        String sets,
        String reps,
        String restTime,
        String instructions
) {}
