package com.agooddeveloper.spring.ai.assistant.validators;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.lang.reflect.Field;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FieldParam {
    private Field field;
    private Object value;
}
