package com.agooddeveloper.spring.ai.assistant.validators;

import com.agooddeveloper.spring.ai.assistant.annotations.IValidator;
import com.agooddeveloper.spring.ai.assistant.annotations.Validated;
import com.agooddeveloper.spring.ai.assistant.utils.LoggerUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Field;
import java.util.*;

@Component
@Aspect
public class ValidationAspect {

    private final ApplicationContext applicationContext;

    @Autowired
    public ValidationAspect(ApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    @Around("@annotation(validated)")
    public Object validate(ProceedingJoinPoint proceedingJoinPoint, Validated validated) throws Throwable {
        LoggerUtil.logInfo("Inside ValidationAspect");
        Object[] args = proceedingJoinPoint.getArgs();
        Object request = args[0];

        List<FieldParam> fieldParams = new ArrayList<>();

        if (!(request instanceof Collection || request instanceof Map)) {
            LoggerUtil.logDebug("Request {} and Object {}", request, request.getClass());
            fieldParams = getAllFields(request);
        }

        HttpServletRequest httpServletRequest =
                ((ServletRequestAttributes) Objects.requireNonNull(
                        RequestContextHolder.getRequestAttributes())).getRequest();

        try {
            if (Objects.nonNull(httpServletRequest.getHeader("X-Forwarded-For"))) {
                String IP = httpServletRequest.getHeader("X-Forwarded-For").split(",")[0];
                LoggerUtil.logDebug("X-Forwarded-For header: {}", IP);
            }

            Class<? extends IValidator>[] validatorClasses = validated.validatorClasses();
            for (Class<? extends IValidator> validatorClass : validatorClasses) {
                IValidator validator = applicationContext.getBean(validatorClass);
                validator.validate(request, httpServletRequest, fieldParams);
            }
        } catch (Exception e) {
            LoggerUtil.logFailure("Validation error: {}", ExceptionUtils.getStackTrace(e));
            ExceptionUtils.getStackTrace(e);
            throw e;
        }

        return proceedingJoinPoint.proceed();
    }

    private List<FieldParam> getAllFields(Object obj) {
        List<FieldParam> fieldParams = new ArrayList<>();
        Field[] fields = obj.getClass().getDeclaredFields();
        Class<?> superclass = obj.getClass().getSuperclass();

        while (superclass != null) {
            Field[] superFields = superclass.getDeclaredFields();
            fields = concatFields(fields, superFields);
            superclass = superclass.getSuperclass();
        }

        for (Field field : fields) {
            field.setAccessible(true);
            try {
                fieldParams.add(new FieldParam(field, field.get(obj)));
            } catch (IllegalAccessException e) {
                LoggerUtil.logFailure("Unable to access field {}: {}", field.getName(), ExceptionUtils.getStackTrace(e));
            }
        }

        return fieldParams;
    }

    private Field[] concatFields(Field[] first, Field[] second) {
        Field[] result = new Field[first.length + second.length];
        System.arraycopy(first, 0, result, 0, first.length);
        System.arraycopy(second, 0, result, first.length, second.length);
        return result;
    }
}

