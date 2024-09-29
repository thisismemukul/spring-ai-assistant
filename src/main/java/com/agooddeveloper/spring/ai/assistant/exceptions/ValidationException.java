package com.agooddeveloper.spring.ai.assistant.exceptions;

public class ValidationException extends RuntimeException {

    private final IBaseError<?> iBaseError;

    public ValidationException(IBaseError<?> iBaseError) {
        super(iBaseError.getErrorMessage());
        this.iBaseError = iBaseError;
    }
    public IBaseError<?> getIBaseError() {
        return iBaseError;
    }

    public String getUserMessage() {
        return iBaseError.getUserMessage();
    }
}
