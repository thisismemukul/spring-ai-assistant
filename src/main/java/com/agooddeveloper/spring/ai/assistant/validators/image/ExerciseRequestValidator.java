package com.agooddeveloper.spring.ai.assistant.validators.image;

import com.agooddeveloper.spring.ai.assistant.annotations.IValidator;
import com.agooddeveloper.spring.ai.assistant.exceptions.DefaultBaseError;
import com.agooddeveloper.spring.ai.assistant.exceptions.ValidationException;
import com.agooddeveloper.spring.ai.assistant.response.exercise.DailyWorkoutPlan;
import com.agooddeveloper.spring.ai.assistant.response.exercise.ExercisePlanResponse;
import com.agooddeveloper.spring.ai.assistant.response.exercise.Exercises;
import com.agooddeveloper.spring.ai.assistant.utils.LoggerUtil;
import com.agooddeveloper.spring.ai.assistant.validators.FieldParam;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.agooddeveloper.spring.ai.assistant.enums.ResponseCode.EXERCISE_INPUT_IS_INVALID;

@Component
public class ExerciseRequestValidator implements IValidator {

    @Override
    public <T> boolean validate(T request, HttpServletRequest httpServletRequest, List<FieldParam> fieldParams) throws IllegalAccessException, InstantiationException {
        LoggerUtil.logInfo("Inside ExerciseRequestValidator");

        if (!(request instanceof ExercisePlanResponse exercisePlanResponse)) {
            throw new IllegalArgumentException("Invalid request type");
        }

        boolean isValid = true;

        if (ObjectUtils.isEmpty(exercisePlanResponse.getFitnessGoal())) {
            LoggerUtil.logInfo("Fitness goal is required.");
            isValid = false;
        }

        if (ObjectUtils.isEmpty(exercisePlanResponse.getExercisePreference())) {
            LoggerUtil.logInfo("Exercise preference is required.");
            isValid = false;
        }

        if (ObjectUtils.isEmpty(exercisePlanResponse.getEquipment())) {
            LoggerUtil.logInfo("Equipment is required.");
            isValid = false;
        }

        if (ObjectUtils.isEmpty(exercisePlanResponse.getWeeklySchedule())) {
            LoggerUtil.logInfo("Weekly schedule is required.");
            isValid = false;
        }

        if (ObjectUtils.isEmpty(exercisePlanResponse.getDailyWorkoutPlan())) {
            LoggerUtil.logInfo("Daily workout plan is required.");
            isValid = false;
        } else {
            for (DailyWorkoutPlan dailyWorkoutPlan : exercisePlanResponse.getDailyWorkoutPlan()) {
                if (ObjectUtils.isEmpty(dailyWorkoutPlan.getBodyPart())) {
                    LoggerUtil.logInfo("Body part is required for each daily workout plan.");
                    isValid = false;
                    continue;
                }

                List<Exercises> exercises = dailyWorkoutPlan.getExercise();
                if (ObjectUtils.isEmpty(exercises)) {
                    LoggerUtil.logInfo("Exercises are required for each daily workout plan.");
                    isValid = false;
                    continue;
                }

                for (Exercises exercise : exercises) {
                    if (ObjectUtils.isEmpty(exercise.getTitle())) {
                        LoggerUtil.logInfo("Exercise title is required.");
                        isValid = false;
                    }
                    if (ObjectUtils.isEmpty(exercise.getSets())) {
                        LoggerUtil.logInfo("Exercise sets are required.");
                        isValid = false;
                    }
                    if (ObjectUtils.isEmpty(exercise.getReps())) {
                        LoggerUtil.logInfo("Exercise reps are required.");
                        isValid = false;
                    }
                    if (ObjectUtils.isEmpty(exercise.getRestTime())) {
                        LoggerUtil.logInfo("Rest time is required.");
                        isValid = false;
                    }
                    if (ObjectUtils.isEmpty(exercise.getInstructions())) {
                        LoggerUtil.logInfo("Exercise instructions are required.");
                        isValid = false;
                    }
                }
            }
        }

        if (!isValid) {
            LoggerUtil.logFailure("Exercise Plan Request is not valid.");
            throw new ValidationException(
                    new DefaultBaseError<>(
                            EXERCISE_INPUT_IS_INVALID.code(),
                            EXERCISE_INPUT_IS_INVALID.message(),
                            EXERCISE_INPUT_IS_INVALID.userMessage(),
                            true)
            );
        }

        return isValid;
    }

}
