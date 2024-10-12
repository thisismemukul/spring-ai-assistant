package com.agooddeveloper.spring.ai.assistant.annotations;

import java.lang.annotation.*;

@Documented
@Inherited
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD})
public @interface Validated {
    Class<? extends IValidator>[] validatorClasses() default {};
}
