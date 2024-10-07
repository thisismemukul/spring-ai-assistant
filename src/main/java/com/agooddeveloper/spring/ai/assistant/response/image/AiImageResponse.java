package com.agooddeveloper.spring.ai.assistant.response.image;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AiImageResponse {
    private TitleImage titleImage;
    private List<IngredientImage> ingredientsImages;
    private List<InstructionImage> instructionsImages;
}