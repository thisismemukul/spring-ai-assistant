package com.agooddeveloper.spring.ai.assistant.constants;

public class Constants {
    public static final String AI = "AI";
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

    public static final String BAD_REQUEST_MESSAGE = "Please check your input and try again!";
    public static final String BAD_REQUEST_USER_MESSAGE = "Whoa there! Looks like you hit a roadblock. 🚧 Don't leave me hanging—let's try that again! ✨";

    public static final String PROMPT_IS_EMPTY_MESSAGE = "Prompt cannot be null or empty.";
    public static final String PROMPT_IS_EMPTY_USER_MESSAGE = "Uh-oh! Looks like you forgot to say something. 🗣️";

    // Exception Messages
    public static final String VALIDATION_ERROR = "VALIDATION_ERROR";

}
