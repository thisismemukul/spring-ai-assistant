package com.agooddeveloper.spring.ai.assistant.validators.image;

import com.agooddeveloper.spring.ai.assistant.annotations.IValidator;
import com.agooddeveloper.spring.ai.assistant.exceptions.DefaultBaseError;
import com.agooddeveloper.spring.ai.assistant.exceptions.ValidationException;
import com.agooddeveloper.spring.ai.assistant.response.recipe.RecipeResponse;
import com.agooddeveloper.spring.ai.assistant.utils.LoggerUtil;
import com.agooddeveloper.spring.ai.assistant.validators.FieldParam;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.agooddeveloper.spring.ai.assistant.enums.ResponseCode.RECIPE_INPUT_IS_INVALID;

@Component
public class RecipeRequestValidator implements IValidator {

    @Override
    public <T> boolean validate(T request, HttpServletRequest httpServletRequest, List<FieldParam> fieldParams) throws IllegalAccessException {
        LoggerUtil.logInfo("Inside RecipeRequestValidator");

        if (!(request instanceof RecipeResponse recipeResponse)) {
            throw new IllegalArgumentException("Invalid request type");
        }

        boolean isValid = true;

        if (ObjectUtils.isEmpty(recipeResponse.title())) {
            LoggerUtil.logInfo("Recipe title is required.");
            isValid = false;
        }

        if (ObjectUtils.isEmpty(recipeResponse.ingredients())) {
            LoggerUtil.logInfo("Ingredients are required.");
            isValid = false;
        }

        if (ObjectUtils.isEmpty(recipeResponse.instructions())) {
            LoggerUtil.logInfo("Instructions are required.");
            isValid = false;
        }

        if (!isValid) {
            LoggerUtil.logFailure("Recipe Request is not valid.");
            throw new ValidationException(
                    new DefaultBaseError<>(
                            RECIPE_INPUT_IS_INVALID.code(),
                            RECIPE_INPUT_IS_INVALID.message(),
                            RECIPE_INPUT_IS_INVALID.userMessage(),
                            true)
            );
        }

        return isValid;
    }
}
