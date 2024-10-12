package com.agooddeveloper.spring.ai.assistant.response.exercise;

import lombok.Data;

import java.util.List;

@Data
public class DailyWorkoutPlan{

    private String bodyPart;
    private List<Exercises> exercise;
}
