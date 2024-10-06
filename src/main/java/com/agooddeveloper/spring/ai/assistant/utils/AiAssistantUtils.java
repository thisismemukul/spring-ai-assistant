package com.agooddeveloper.spring.ai.assistant.utils;

import com.agooddeveloper.spring.ai.assistant.enums.ResponseCode;
import com.agooddeveloper.spring.ai.assistant.exceptions.DefaultBaseError;
import com.agooddeveloper.spring.ai.assistant.exceptions.ValidationException;
import org.apache.commons.lang3.StringUtils;
import reactor.core.publisher.Mono;

import static com.agooddeveloper.spring.ai.assistant.enums.ResponseCode.*;

public class AiAssistantUtils {

    public static Mono<String> validateChatInputs(String prompt, String model) {
        if (StringUtils.isBlank(prompt)) {
            return Mono.error(createValidationException(PROMPT_IS_EMPTY));
        }
        return validateModel(model);
    }

    public static Mono<String> validateRecipeInputs(String ingredients, String cuisine, String dietaryRestrictions, String model) {
        if (StringUtils.isBlank(ingredients) || StringUtils.isBlank(cuisine) || StringUtils.isBlank(dietaryRestrictions)) {
            throw new ValidationException(
                    new DefaultBaseError<>(
                            RECIPE_INPUT_IS_INVALID.code(),
                            RECIPE_INPUT_IS_INVALID.message(),
                            RECIPE_INPUT_IS_INVALID.userMessage(),
                            true)
            );
        }
        return validateModel(model);
    }

    private static Mono<String> validateModel(String model) {
        if (StringUtils.isBlank(model)) {
            return Mono.error(createValidationException(MODEL_IS_INVALID));
        }
        return Mono.just(model.toLowerCase());
    }

    public static ValidationException createValidationException(ResponseCode code) {
        return new ValidationException(
                new DefaultBaseError<>(
                        code.code(),
                        code.message(),
                        code.userMessage()
                )
        );
    }
}
