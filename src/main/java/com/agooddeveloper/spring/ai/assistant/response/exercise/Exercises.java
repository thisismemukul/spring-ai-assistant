package com.agooddeveloper.spring.ai.assistant.response.exercise;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Exercises{

    private String title;
    private String sets;
    private String reps;
    private String restTime;
    private String instructions;

}
