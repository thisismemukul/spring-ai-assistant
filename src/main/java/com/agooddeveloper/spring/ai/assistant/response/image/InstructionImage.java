package com.agooddeveloper.spring.ai.assistant.response.image;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InstructionImage {
    private String title;
    private byte[] image;
}