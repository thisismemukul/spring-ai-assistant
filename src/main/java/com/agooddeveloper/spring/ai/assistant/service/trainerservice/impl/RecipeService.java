package com.agooddeveloper.spring.ai.assistant.service.trainerservice.impl;

import com.agooddeveloper.spring.ai.assistant.exceptions.ValidationException;
import com.agooddeveloper.spring.ai.assistant.response.recipe.RecipeResponse;
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
public class RecipeService implements ITrainerService {

    private final ChatModel ollamaChatModel;
    private final ChatModel openAiChatModel;

    @Autowired
    public RecipeService(@Qualifier("ollamaChatModel") ChatModel ollamaChatModel,
                         @Qualifier("openAiChatModel") ChatModel openAiChatModel) {
        this.ollamaChatModel = ollamaChatModel;
        this.openAiChatModel = openAiChatModel;
    }

    @Override
    public Mono<RecipeResponse> createPlan(String ingredients, String cuisine, String dietaryRestrictions, String model) throws ValidationException {
        return validateRecipeInputs(ingredients, cuisine, dietaryRestrictions, model)
                .flatMap(validModel -> {
                    switch (validModel) {
                        case OPEN_AI -> {
                            return createRecipe(ingredients, cuisine, dietaryRestrictions, openAiChatModel)
                                    .timeout(OPEN_AI_TIMEOUT)
                                    .onErrorResume(TimeoutException.class, e -> {
                                        LoggerUtil.logFailure("Timeout occurred while processing OpenAI chat prompt", e);
                                        return Mono.error(new TimeoutException(e.getMessage()));
                                    });
                        }
                        case O_LLAMA_AI -> {
                            return createRecipe(ingredients, cuisine, dietaryRestrictions, ollamaChatModel)
                                    .timeout(O_LLAMA_AI_TIMEOUT)
                                    .onErrorResume(TimeoutException.class, e -> {
                                        LoggerUtil.logFailure("Timeout occurred while processing OLlama chat prompt", e);
                                        return Mono.error(new TimeoutException(e.getMessage()));
                                    });
                        }
                        default -> {
                            return Mono.error(createValidationException(MODEL_IS_INVALID));
                        }
                    }
                });
    }

    public Mono<RecipeResponse> createRecipe(String ingredients, String cuisine, String dietaryRestrictions, ChatModel chatModel) {
        return Mono.fromCallable(() -> {
            try {

                BeanOutputConverter<RecipeResponse> recipeResponseBeanOutputConverter =
                        new BeanOutputConverter<>(RecipeResponse.class);
                String format = recipeResponseBeanOutputConverter.getFormat();

                Map<String, Object> templateModel = new HashMap<>();
                templateModel.put("ingredients", ingredients);
                templateModel.put("cuisine", cuisine);
                templateModel.put("dietaryRestrictions", dietaryRestrictions);
                templateModel.put("format", format);

                PromptTemplate promptTemplate = new PromptTemplate(getRecipeTemplate(), templateModel);
                Prompt prompt = promptTemplate.create();
                Generation generation = chatModel.call(prompt).getResult();
                LoggerUtil.logInfo("Response received for createRecipe.");
                return recipeResponseBeanOutputConverter.convert(generation.getOutput().getContent());
            } catch (Exception e) {
                LoggerUtil.logFailure("Error occurred while processing createRecipe prompt: '{}'", chatModel, e);
                throw new RuntimeException(e.getMessage(), e);
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }
}
