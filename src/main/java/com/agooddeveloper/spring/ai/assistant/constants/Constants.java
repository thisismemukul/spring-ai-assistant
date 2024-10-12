package com.agooddeveloper.spring.ai.assistant.constants;

import java.time.Duration;

public class Constants {
    public static final String AI = "AI";

    public static final String OPEN_AI = "openai";
    public static final String O_LLAMA_AI = "ollama";
    public static final String AI_MODEL = "mixtral-8x7b-32768";

    // Health Check
    public static final String AI_HEALTH_CHECK = """
        Welcome to AI! 🚀✨
        Everything is running smoothly...for now. But don’t worry, the bugs 🐛🐜 are on vacation! 😎
        Ready to create magic with AI? 🎨💡 Let's go before they come back! ⚡💥
        """;

    //Message And User Message Constants
    public static final String SUCCESS_MESSAGE = "SUCCESS";
    public static final String SUCCESS_USER_MESSAGE = "Woohoo! Everything went just as planned! 🎉";

    public static final String PENDING_MESSAGE = "PENDING";
    public static final String PENDING_USER_MESSAGE = "Hold on tight! We're almost there... ⏳";

    public static final String FAILED_MESSAGE = "FAILED";
    public static final String FAILED_USER_MESSAGE = "Oops! Something went wrong. Let's try again! 🙈";

    public static final Duration OPEN_AI_TIMEOUT = Duration.ofSeconds(5);
    public static final Duration O_LLAMA_AI_TIMEOUT = Duration.ofSeconds(100000);

    //400
    public static final String BAD_REQUEST_MESSAGE = "Please check your input and try again!";
    public static final String BAD_REQUEST_USER_MESSAGE = "Whoa there! Looks like you hit a roadblock. 🚧 Don't leave me hanging—let's try that again! ✨";

    public static final String PROMPT_IS_EMPTY_MESSAGE = "Prompt cannot be null or empty.";
    public static final String PROMPT_IS_EMPTY_USER_MESSAGE = "Uh-oh! Looks like you forgot to say something. 🗣️";

    public static final String MODEL_IS_INVALID_MESSAGE = "The specified model is not supported.";
    public static final String MODEL_IS_INVALID_USER_MESSAGE = "Uh-oh! Looks like you forgot to specify either 'openai' or 'ollama' as the model. 🗣️";

    public static final String INPUT_IS_INVALID_MESSAGE = "Invalid Input: parameters are empty.";
    public static final String INPUT_IS_INVALID_USER_MESSAGE = "Uh-oh! Looks like you forgot what are the parameters. 👩‍🍳🔪";

    public static final String RECIPE_INPUT_IS_INVALID_MESSAGE = "Invalid Input: Recipe is not valid.";
    public static final String RECIPE_INPUT_IS_INVALID_USER_MESSAGE = "Hold up! It looks like your recipe has gone on vacation. Time to reel it back in! 🌴🥳";

    public static final String DIET_INPUT_IS_INVALID_MESSAGE = "Invalid Input: Diet goal is not valid.";
    public static final String DIET_INPUT_IS_INVALID_USER_MESSAGE = "Hold up! It looks like your diet goal has gone on vacation. Time to reel it back in! 🌴🥳";

    public static final String EXERCISE_INPUT_IS_INVALID_MESSAGE = "Invalid Input: Exercise plan is not valid.";
    public static final String EXERCISE_INPUT_IS_INVALID_USER_MESSAGE = "Hold up! It looks like your exercise plan has gone on vacation. Time to reel it back in! 🌴🥳";

    //500
    public static final String NULL_POINTER_EXCEPTION_MESSAGE = "A null pointer exception occurred: ";
    public static final String NULL_POINTER_EXCEPTION_USER_MESSAGE = "Yikes! Something’s missing! 😱 The bugs must be having a party. 🐛🍕";

    public static final String RUNTIME_EXCEPTION_MESSAGE = "A runtime error occurred. ";
    public static final String RUNTIME_EXCEPTION_USER_MESSAGE = "Oops! Something went wrong while we were running! ⚡";

    public static final String TIMEOUT_EXCEPTION_MESSAGE = "Model call timed out : ";
    public static final String TIMEOUT_EXCEPTION_USER_MESSAGE = "Looks like our model went for a coffee break. We'll try harder next time! ☕";

    // Exception Messages
    public static final String VALIDATION_ERROR = "VALIDATION_ERROR";
    public static final String NULL_POINTER = "NULL_POINTER";
    public static final String RUNTIME_ERROR = "RUNTIME_ERROR";
    public static final String TIMEOUT_ERROR = "TIMEOUT_ERROR";

}
