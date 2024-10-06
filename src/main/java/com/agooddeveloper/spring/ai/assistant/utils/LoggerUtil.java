package com.agooddeveloper.spring.ai.assistant.utils;

import com.agooddeveloper.spring.ai.assistant.enums.ResponseCode;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class LoggerUtil {

    public static void logFailure(String action, Object... details) {
        if (details != null && details.length > 0) {
            Object lastDetail = details[details.length - 1];

            if (lastDetail instanceof Throwable exception) {
                log.error("Action '{}' failed with code {}: Exception - {}", action, ResponseCode.FAILED.code(), exception.getMessage(), exception);
            } else {
                log.error("Action '{}' failed with code {}: {}", action, ResponseCode.FAILED.code(), details);
            }
        } else {
            log.error("Action '{}' failed with code {}: No additional details provided", action, ResponseCode.FAILED.code());
        }
    }

    public static void logWarning(String message, Object... details) {
        log.warn(message, details);
    }

    public static void logInfo(String message, Object... details) {
        log.info(message, details);
    }

    public static void logDebug(String message, Object... details) {
        log.debug(message, details);
    }
}
