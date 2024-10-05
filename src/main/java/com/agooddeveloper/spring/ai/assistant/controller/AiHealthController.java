package com.agooddeveloper.spring.ai.assistant.controller;

import com.agooddeveloper.spring.ai.assistant.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.agooddeveloper.spring.ai.assistant.constants.Constants.AI_HEALTH_CHECK;
import static com.agooddeveloper.spring.ai.assistant.constants.RESTUriConstants.HEALTH_CHECK;

@RestController
public class AiHealthController {

    @GetMapping(HEALTH_CHECK)
    public ResponseEntity<ApiResponse<String>> index() {
        ApiResponse<String> response = new ApiResponse<>(AI_HEALTH_CHECK, HttpStatus.OK.value(), "AI API");
        return ResponseEntity.ok(response);
    }

}
