package com.agooddeveloper.spring.ai.assistant.enums;

import lombok.AllArgsConstructor;

import static com.agooddeveloper.spring.ai.assistant.constants.Constants.*;

@AllArgsConstructor
public enum ResponseCode {
    SUCCESS("AI-0000", SUCCESS_MESSAGE, SUCCESS_USER_MESSAGE),
    PENDING("AI-0001", PENDING_MESSAGE, PENDING_USER_MESSAGE),
    FAILED("AI-0002", FAILED_MESSAGE, FAILED_USER_MESSAGE),
    BAD_REQUEST("AI-4000", BAD_REQUEST_MESSAGE, BAD_REQUEST_USER_MESSAGE),
    PROMPT_IS_EMPTY("AI-4001", PROMPT_IS_EMPTY_MESSAGE, PROMPT_IS_EMPTY_USER_MESSAGE),
    MODEL_IS_INVALID("AI-4002", MODEL_IS_INVALID_MESSAGE, MODEL_IS_INVALID_USER_MESSAGE);

    private final String code;
    private final String message;
    private final String userMessage;


    public String code() { return code; }

    public String message() {
        return message;
    }

    public String userMessage() {
        return userMessage;
    }

}
