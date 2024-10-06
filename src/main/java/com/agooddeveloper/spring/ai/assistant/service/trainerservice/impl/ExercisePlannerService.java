package com.agooddeveloper.spring.ai.assistant.service.trainerservice.impl;

import com.agooddeveloper.spring.ai.assistant.service.trainerservice.ITrainerService;
import com.agooddeveloper.spring.ai.assistant.utils.LoggerUtil;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeoutException;

import static com.agooddeveloper.spring.ai.assistant.constants.Constants.*;
import static com.agooddeveloper.spring.ai.assistant.enums.ResponseCode.MODEL_IS_INVALID;
import static com.agooddeveloper.spring.ai.assistant.utils.AiAssistantUtils.*;

@Service
public class ExercisePlannerService implements ITrainerService {

    private final ChatModel ollamaChatModel;
    private final ChatModel openAiChatModel;

    @Autowired
    public ExercisePlannerService(@Qualifier("ollamaChatModel") ChatModel ollamaChatModel,
                                  @Qualifier("openAiChatModel") ChatModel openAiChatModel) {
        this.ollamaChatModel = ollamaChatModel;
        this.openAiChatModel = openAiChatModel;
    }

    @Override
    public <T> Mono<T> createPlan(String fitnessGoal, String exercisePreference, String equipment, String model, Class<T> responseType) {
        return validateChatInputs(fitnessGoal, exercisePreference, equipment, model)
                .flatMap(validModel -> {
                    switch (validModel) {
                        case OPEN_AI -> {
                            return createExercisePlan(fitnessGoal, exercisePreference, equipment, openAiChatModel, responseType)
                                    .timeout(OPEN_AI_TIMEOUT)
                                    .onErrorResume(TimeoutException.class, e -> {
                                        LoggerUtil.logFailure("Timeout occurred while processing createExercisePlan OpenAI chat prompt", e);
                                        return Mono.error(new TimeoutException(e.getMessage()));
                                    });
                        }
                        case O_LLAMA_AI -> {
                            return createExercisePlan(fitnessGoal, exercisePreference, equipment, ollamaChatModel, responseType)
                                    .timeout(O_LLAMA_AI_TIMEOUT)
                                    .onErrorResume(TimeoutException.class, e -> {
                                        LoggerUtil.logFailure("Timeout occurred while processing createExercisePlan OLlama chat prompt", e);
                                        return Mono.error(new TimeoutException(e.getMessage()));
                                    });
                        }
                        default -> {
                            return Mono.error(createValidationException(MODEL_IS_INVALID));
                        }
                    }
                });
    }

    private <T> Mono<T> createExercisePlan(String fitnessGoal, String exercisePreference, String equipment, ChatModel chatModel, Class<T> responseType) {
        return Mono.fromCallable(() -> {
            try {
                BeanOutputConverter<T> outputConverter = new BeanOutputConverter<>(responseType);
                String format = outputConverter.getFormat();

                Map<String, Object> templateModel = new HashMap<>();
                templateModel.put("fitnessGoal", fitnessGoal);
                templateModel.put("exercisePreference", exercisePreference);
                templateModel.put("equipment", equipment);
                templateModel.put("format", format);

                PromptTemplate promptTemplate = new PromptTemplate(getExerciseTemplate(), templateModel);
                Prompt prompt = promptTemplate.create();
                Generation generation = chatModel.call(prompt).getResult();
                LoggerUtil.logInfo("Response received for createExercisePlan.");
                return outputConverter.convert(generation.getOutput().getContent());
            } catch (Exception e) {
                LoggerUtil.logFailure("Error occurred while processing create exercise plan prompt: '{}'", chatModel, e);
                throw new RuntimeException(e.getMessage(), e);
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }
}
