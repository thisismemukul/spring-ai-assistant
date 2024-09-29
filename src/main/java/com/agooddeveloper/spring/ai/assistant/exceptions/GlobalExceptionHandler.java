package com.agooddeveloper.spring.ai.assistant.exceptions;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<DefaultBaseError<?>> handleValidationException(ValidationException ex) {
        DefaultBaseError<Object> objectDefaultBaseError = new DefaultBaseError<>(
                ex.getIBaseError().getErrorCode(),
                ex.getIBaseError().getErrorMessage(),
                ex.getIBaseError().getUserMessage(),
                "Validation Error",
                ex.getIBaseError().displayMsg()
        );
        return ResponseEntity.badRequest().body(objectDefaultBaseError);
    }
}
