package com.agooddeveloper.spring.ai.assistant.annotations;

import com.agooddeveloper.spring.ai.assistant.validators.FieldParam;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;

public interface IValidator {

    <T> boolean validate(
            T request,
            HttpServletRequest httpServletRequest,
            List<FieldParam> fieldParams
    )
            throws IllegalAccessException, InstantiationException;
}
