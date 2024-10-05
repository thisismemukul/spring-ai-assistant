package com.agooddeveloper.spring.ai.assistant.response;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Builder;
import lombok.Data;

import static com.agooddeveloper.spring.ai.assistant.enums.ResponseCode.SUCCESS;

@Data
@Builder
@JsonSerialize
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {
    private final String message;
    private final int status;
    private final T data;

    public ApiResponse(T data) {
        this.message = SUCCESS.message();
        this.status = Integer.parseInt(SUCCESS.code());
        this.data = data;
    }

    public ApiResponse(String message, int status, T data) {
        this.message = message;
        this.status = status;
        this.data = data;
    }
}