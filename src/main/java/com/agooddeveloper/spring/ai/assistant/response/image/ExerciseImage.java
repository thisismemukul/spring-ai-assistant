package com.agooddeveloper.spring.ai.assistant.response.image;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ExerciseImage {
    private String title;
    private byte[] image;
}