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
public class DietPlannerService implements ITrainerService {

    private final ChatModel ollamaChatModel;
    private final ChatModel openAiChatModel;

    @Autowired
    public DietPlannerService(@Qualifier("ollamaChatModel") ChatModel ollamaChatModel,
                              @Qualifier("openAiChatModel") ChatModel openAiChatModel) {
        this.ollamaChatModel = ollamaChatModel;
        this.openAiChatModel = openAiChatModel;
    }


    @Override
    public <T> Mono<T> createPlan(String dietGoal, String foodPreferences, String dietaryRestrictions, String model, Class<T> responseType) {
        return validateChatInputs(dietGoal, foodPreferences, dietaryRestrictions, model)
                .flatMap(validModel -> {
                    switch (validModel) {
                        case OPEN_AI -> {
                            return createDietPlan(dietGoal, foodPreferences, dietaryRestrictions, openAiChatModel, responseType)
                                    .timeout(OPEN_AI_TIMEOUT)
                                    .onErrorResume(TimeoutException.class, e -> {
                                        LoggerUtil.logFailure("Timeout occurred while processing createDietPlan OpenAI chat prompt", e);
                                        return Mono.error(new TimeoutException(e.getMessage()));
                                    });
                        }
                        case O_LLAMA_AI -> {
                            return createDietPlan(dietGoal, foodPreferences, dietaryRestrictions, ollamaChatModel, responseType)
                                    .timeout(O_LLAMA_AI_TIMEOUT)
                                    .onErrorResume(TimeoutException.class, e -> {
                                        LoggerUtil.logFailure("Timeout occurred while processing createDietPlan OLlama chat prompt", e);
                                        return Mono.error(new TimeoutException(e.getMessage()));
                                    });
                        }
                        default -> {
                            return Mono.error(createValidationException(MODEL_IS_INVALID));
                        }
                    }
                });
    }

    private <T> Mono<T> createDietPlan(String dietGoal, String foodPreferences, String dietaryRestrictions, ChatModel chatModel, Class<T> responseType) {
        return Mono.fromCallable(() -> {
            try {
                BeanOutputConverter<T> outputConverter = new BeanOutputConverter<>(responseType);
                String format = outputConverter.getFormat();

                Map<String, Object> templateModel = new HashMap<>();
                templateModel.put("dietGoal", dietGoal);
                templateModel.put("foodPreferences", foodPreferences);
                templateModel.put("dietaryRestrictions", dietaryRestrictions);
                templateModel.put("format", format);

                PromptTemplate promptTemplate = new PromptTemplate(getDietTemplate(), templateModel);
                Prompt prompt = promptTemplate.create();
                Generation generation = chatModel.call(prompt).getResult();
                LoggerUtil.logInfo("Response received for createRecipe.");
                return outputConverter.convert(generation.getOutput().getContent());
            } catch (Exception e) {
                LoggerUtil.logFailure("Error occurred while processing create diet plan prompt: '{}'", chatModel, e);
                throw new RuntimeException(e.getMessage(), e);
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }
}