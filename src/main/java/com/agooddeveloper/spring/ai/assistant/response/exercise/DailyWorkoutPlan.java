package com.agooddeveloper.spring.ai.assistant.response.exercise;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyWorkoutPlan{

    private String bodyPart;
    private List<Exercises> exercise;
}
