package com.agooddeveloper.spring.ai.assistant.exceptions;

import com.agooddeveloper.spring.ai.assistant.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import static com.agooddeveloper.spring.ai.assistant.constants.Constants.NULL_POINTER;
import static com.agooddeveloper.spring.ai.assistant.constants.Constants.VALIDATION_ERROR;
import static com.agooddeveloper.spring.ai.assistant.enums.ResponseCode.NULL_POINTER_EXCEPTION;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<DefaultBaseError<?>>> handleValidationException(ValidationException ex) {
        DefaultBaseError<Object> objectDefaultBaseError = new DefaultBaseError<>(
                ex.getIBaseError().getErrorCode(),
                ex.getIBaseError().getErrorMessage(),
                ex.getIBaseError().getUserMessage(),
                VALIDATION_ERROR,
                ex.getIBaseError().displayMsg()
        );
        ApiResponse<DefaultBaseError<?>> apiResponse = new ApiResponse<>(
                ex.getMessage(),
                HttpStatus.BAD_REQUEST.value(),
                objectDefaultBaseError
        );
        return ResponseEntity.badRequest().body(apiResponse);
    }

    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<ApiResponse<DefaultBaseError<?>>> handleNullPointerException(NullPointerException ex) {
        DefaultBaseError<?> errorResponse = new DefaultBaseError<>(
                NULL_POINTER_EXCEPTION.code(),
                NULL_POINTER_EXCEPTION.message() + ex.getMessage(),
                NULL_POINTER_EXCEPTION.userMessage(),
                NULL_POINTER,
                false
        );
        ApiResponse<DefaultBaseError<?>> apiResponse = new ApiResponse<>(
                NULL_POINTER_EXCEPTION.message(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                errorResponse
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
    }

}
