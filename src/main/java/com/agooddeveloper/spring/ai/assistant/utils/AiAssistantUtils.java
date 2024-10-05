package com.agooddeveloper.spring.ai.assistant.utils;

import com.agooddeveloper.spring.ai.assistant.enums.ResponseCode;
import com.agooddeveloper.spring.ai.assistant.exceptions.DefaultBaseError;
import com.agooddeveloper.spring.ai.assistant.exceptions.ValidationException;
import org.apache.commons.lang3.StringUtils;
import reactor.core.publisher.Mono;

import static com.agooddeveloper.spring.ai.assistant.enums.ResponseCode.MODEL_IS_INVALID;
import static com.agooddeveloper.spring.ai.assistant.enums.ResponseCode.PROMPT_IS_EMPTY;

public class AiAssistantUtils {

    public static Mono<String> validateInputs(String prompt, String model) {
        if (StringUtils.isBlank(prompt)) {
            return Mono.error(createValidationException(PROMPT_IS_EMPTY));
        }
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
