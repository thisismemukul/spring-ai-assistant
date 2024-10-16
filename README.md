# spring-ai-assistant
<p align="center">
<img src="https://github.com/thisismemukul/spring-ai-assistant/blob/main/assets/cover.png" alt="Spring AI App" title="Spring AI App show gif" width="500"/>
</p>
This project demonstrates how to integrate OpenAI, OLlama and Stability AI using Spring Boot and provides a chat service and Image Generation functionality where the application interacts with AI models to return responses to user inputs. The project also features health check endpoints for basic monitoring.
<h4>* Tech Stack used:</h4>
<ul>
<li>Spring Boot</li>
<li>Spring AI</li>
<li>OpenAI</li>
<li>OLlama</li>
<li>Stability AI</li>
</ul>

<h3> APP Link 🔗: //TODO </h3>
<h3> UI Link 🔗: //TODO </h3>

<p align="center">
<img src="https://github.com/thisismemukul/spring-ai-assistant/blob/main/assets/demo.gif" alt="Spring AI App" title="Spring AI App show gif" width="500"/>
</p>

- [Installation Guide](#installation-guide) - How to get started with Spring AI App

# <a name='installation-guide'>Installation Guide</a>

This project requires the following tools:

- [NPM](https://start.spring.io/) - A quickstart generator for Spring projects and install mvn dependencies.


### Project Folder Structure
```css
/src
 ├── main
 │   ├── java
 │   │   └── com
 │   │       └── agooddeveloper
 │   │           └── spring
 │   │               └── ai
 │   │                   └── assistant
 │   │                       ├── config
 │   │                       │   └── WebConfig.java
 │   │                       ├── constants
 │   │                       │   ├── Constants.java
 │   │                       │   └── RestURIConstants.java
 │   │                       ├── controller
 │   │                       │   ├── AIController.java
 │   │                       │   └── AIImageGenController.java
 │   │                       ├── dto
 │   │                       │   ├── ImageResponseDto.java
 │   │                       │   ├── IngredientImageDto.java
 │   │                       │   ├── InstructionImageDto.java
 │   │                       │   └── TitleImageDto.java
 │   │                       ├── enums
 │   │                       │   └── ResponseCode.java
 │   │                       ├── exceptions
 │   │                       │   ├── IBaseError.java
 │   │                       │   ├── DefaultBaseError.java
 │   │                       │   ├── GlobalExceptionHandler.java
 │   │                       │   └── ValidationException.java
 │   │                       ├── helper
 │   │                       │   ├── ImageGenerationHelper.java
 │   │                       │   └── AiHelper.java
 │   │                       ├── response
 │   │                       │   ├── ApiResponse.java
 │   │                       │   └── diet
 │   │                       │       ├── DayMealPlan.java
 │   │                       │       ├── DietPlanResponse.java
 │   │                       │       ├── Meal.java
 │   │                       │       ├── MealSuggestion.java
 │   │                       │       └── NutritionalDietInformation.java
 │   │                       │   └── trainer
 │   │                       │       ├── exercise
 │   │                       │       │   ├── DailyWorkoutPlan.java
 │   │                       │       │   ├── Exercise.java
 │   │                       │       │   └── ExercisePlanResponse.java
 │   │                       │       └── recipe
 │   │                       │           ├── NutritionalInformation.java
 │   │                       │           └── RecipeResponse.java
 │   │                       ├── service
 │   │                       │   ├── chatservice
 │   │                       │   │   ├── IAIService.java
 │   │                       │   │   └── impl
 │   │                       │   │       └── ChatService.java
 │   │                       │   ├── imageservice
 │   │                       │   │   ├── IImageService.java
 │   │                       │   │   └── impl
 │   │                       │   │       ├── OpenAIImageService.java
 │   │                       │   │       └── StabilityAIImageService.java
 │   │                       │   └── trainerservice
 │   │                       │       ├── ITrainerService.java
 │   │                       │       └── impl
 │   │                       │           ├── RecipeService.java
 │   │                       │           ├── PersonalGymTrainerService.java
 │   │                       │           └── DietPlannerService.java
 │   │                       ├── utils
 │   │                       │   ├── ImageGenUtil.java
 │   │                       │   ├── LoggerUtil.java
 │   │                       │   ├── ObjectMapperUtil.java
 │   │                       │   └── TrainerServiceUtil.java
 │   │                       └── SpringAiAssistantApplication.java
 │   └── resources
 │       └── application.properties
 └── test
     └── java
         └── com
             └── agooddeveloper
                 └── spring
                     └── ai
                         └── assistant
```
### Order of Implementation

1. **Define the Interface for AI Service**  
   Create an interface to define the AI response retrieval functionality.

   ```java
   public interface IAIService {
       String getResponse(String prompt);
   }
   ```

2. **Implement the Chat Service**  
   Implement the `ChatService` class to interact with OpenAI using the `ChatModel`.

   ```java
   package com.agooddeveloper.spring.ai.assistant.service.chatservice.impl;

   import com.agooddeveloper.spring.ai.assistant.service.chatservice.IAIService;
   import lombok.Data;
   import org.springframework.ai.chat.model.ChatModel;
   import org.springframework.ai.chat.model.ChatResponse;
   import org.springframework.ai.chat.prompt.Prompt;
   import org.springframework.ai.openai.OpenAiChatOptions;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.stereotype.Service;

   @Data
   @Service
   public class ChatService implements IAIService {

       private final ChatModel openAiChatModel;

       @Autowired
       public ChatService(ChatModel openAiChatModel) {
           this.openAiChatModel = openAiChatModel;
       }

       @Override
       public String getResponse(String prompt) {
           ChatResponse response = openAiChatModel.call(
               new Prompt(
                   prompt,
                   OpenAiChatOptions.builder()
                       .withModel("mixtral-8x7b-32768")
                       .withTemperature(0.4F)
                       .build()
               ));
           System.out.println(response);
           return "I will return AI response.";
       }
   }
   ```

3. **Add Maven Dependencies**  
   Add the following dependencies in your `pom.xml` file.


   ```xml
<dependency>
    <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.34</version>
    <scope>provided</scope>
</dependency>
<dependency>
    <groupId>org.springframework.ai</groupId>
        <artifactId>spring-ai-openai-spring-boot-starter</artifactId>
</dependency>

<dependency>
    <groupId>org.apache.httpcomponents.client5</groupId>
        <artifactId>httpclient5</artifactId>
    <version>5.2.1</version>
</dependency>
```

   **Note:** If you encounter an error while fetching the `spring-ai-openai-spring-boot-starter` dependency, make sure the dependency is available or consider using another compatible package.

4. **Run the Application**  
   If you encounter an error like `Could not find artifact org.springframework.ai:spring-ai-openai-spring-boot-starter`, ensure the correct Maven repository or version is configured or consider fetching a proper version from a valid repository.

5. **Add Properties**  
   Add the following properties in `application.properties` to configure your OpenAI API key and base URL.

   ```properties
   spring.application.name=SpringAiAssistant
   spring.ai.openai.api-key=${MY_AI_APP_KEY}
   spring.ai.openai.base-url=https://api.groq.com/openai
   ```

6. **Create AI Controller**  
   Create a simple controller to test the health of the application and interact with the chat service.

   ```java
   package com.agooddeveloper.spring.ai.assistant.controller;

   import com.agooddeveloper.spring.ai.assistant.service.chatservice.impl.ChatService;
   import org.springframework.beans.factory.annotation.Autowired;
   import org.springframework.web.bind.annotation.GetMapping;
   import org.springframework.web.bind.annotation.RestController;

   @RestController
   public class AIController {

       private final ChatService chatService;

       @Autowired
       public AIController(ChatService chatService) {
           this.chatService = chatService;
       }

       @GetMapping("/health")
       public String health() {
           return "I am healthy";
       }

       @GetMapping("/chat")
       public String getChatResponse() {
           return chatService.getResponse("Hello How Are You");
       }
   }
   ```

7. **Run the App and Interact with AI**  
   Once your application is up and running, you can test the endpoints:

    - Health check: [http://localhost:8080/health](http://localhost:8080/health)
    - Chat response: [http://localhost:8080/chat](http://localhost:8080/chat)

   **Example Response:**

   ```
   Hello! I'm just a computer program, so I don't have feelings, but I'm here and ready to assist you. How can I help you today? Is there a specific question you would like to ask? I'm here to provide information and answer questions to the best of my ability.
   ```
8. **Use Flux<String>**
```java
public Flux<String> getChatResponse(@RequestParam String prompt) {
        return chatService.getResponse(prompt);
}
```
9. **Throw IllegalArgumentException**
```java 
if (StringUtils.isBlank(prompt)) {
    return Flux.error(new IllegalArgumentException("Prompt is empty"));
}
```
10. Exception Handling
```text
impl DefaultBaseError
custom Exception and throw ValidationException
GlobalExceptionHandler and throw ValidationException
Bindup the error in ResponseEntity in GlobalExceptionHandler
```
11. Global Exception handling
```java
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<DefaultBaseError<?>> handleValidationException(ValidationException ex) {
        DefaultBaseError<Object> objectDefaultBaseError = new DefaultBaseError<>(
                ex.getIBaseError().getErrorCode(),
                ex.getIBaseError().getErrorMessage(),
                ex.getIBaseError().getUserMessage(),
                "Validation Error",
                ex.getIBaseError().displayMsg()
        );
        return ResponseEntity.badRequest().body(objectDefaultBaseError);
    }
```
```json
{
  "errorCode": "AI-4001",
  "errorMessage": "Prompt is empty",
  "userMessage": "Ugh !! seems like you forgot to say something",
  "errorType": "Validation Error",
  "metadata": null
}
```
12. Added Mono and Api Response
```java
    return Mono.fromCallable(() ->{}
```
13. Define Constants and REST constants
14. Define ResponseCode Enums
15. Implement Model OLlama
    1. [Download OLlama from here](https://ollama.com/download)
    2. OLlama default port - [http://localhost:11434/](http://localhost:11434/)
    3. Choose model - 
    ```bash 
       ollama run mistral
      ```
    4. Update Pom.xml install the following dependency
    ```xml
    <dependency>
      <groupId>org.springframework.ai</groupId>
      <artifactId>spring-ai-ollama-spring-boot-starter</artifactId>
    </dependency>
      ```
    5. Update application properties and add the following properties
    ```properties
    spring.ai.ollama.base-url=http://localhost:11434
    spring.ai.ollama.chat.options.model=mistral
    spring.ai.ollama.chat.options.temperature=0.7
      ```
16. Make first call to OLlama
```java
    return switch (model.toLowerCase()) {
            case OPEN_AI -> openAIChat(prompt, openAiChatModel);
            case O_LLAMA_AI -> ollamaChat(prompt, ollamaChatModel);
            default -> Mono.error(
                    new ValidationException(
                            new DefaultBaseError<>(
                                    MODEL_IS_INVALID.code(),
                                    MODEL_IS_INVALID.message(),
                                    MODEL_IS_INVALID.userMessage())
            ));
    };
```
17. Handle NullPointerException
```json
{
  "message": "A null pointer exception occurred: ",
  "status": 500,
  "data": {
    "errorCode": "KIDDO-5001",
    "errorMessage": "A null pointer exception occurred: Cannot invoke \"reactor.core.publisher.Mono.flatMap(java.util.function.Function)\" because the return value of \"com.agooddeveloper.spring.ai.assistant.service.chatservice.impl.ChatService.getResponse(String, String)\" is null",
    "userMessage": "Yikes! Something’s missing! 😱 The bugs must be having a party. 🐛🍕",
    "errorType": "NULL_POINTER",
    "metadata": null
  }
}
```
18. Handle RuntimeException
```json
{
"message": "A runtime error occurred. ",
"status": 500,
"data": {
    "errorCode": "AI-5002",
    "errorMessage": "A runtime error occurred. [404] Not Found - {\"error\":\"model \\\"llama3.1\\\" not found, try pulling it first\"}",
    "userMessage": "Oops! Something went wrong while we were running! ⚡",
    "errorType": "RUNTIME_ERROR",
    "metadata": null
  }
}
```
19. Refactoring and writing clean ```code```
    1. ```createValidationException``` and ```validateInputs```.
    2. ```buildErrorResponse``` in GlobalExceptionHandler
20. **Async call Blocking problem.**
    1.  Problem:
    ```text
    API 1 -> OpenAI
    API 2 -> OpenAI
    API 3 -> Ollama
    API 4 -> OpenAI
    API 5 -> OLlama
    I hit these 5 APIs using postman Runner
    1 and 2 are running fast but 3rd one ollama is taking too long as it is running on localhost (but we will take this problem as it exists on any other live server)
    thus its blocking to execute 4th api that can give response in seconds
    because of 3rd API 4th one is on hold
    ```
    2. Solution
    ```text
    Using .subscribeOn(Schedulers.boundedElastic()); // Prevent blocking 
    and .timeout
    ``` 
    3. Throw Timeout Exception
    ```java
    case O_LLAMA_AI -> {
    return ollamaChat(prompt, ollamaChatModel)
        .timeout(Duration.ofSeconds(20))
        .onErrorResume(TimeoutException.class, e -> {
        log.error("Timeout occurred while processing ollama chat prompt: '{}'", prompt, e);
        return Mono.error(new TimeoutException(e.getMessage()));
        });
    }
    ```
    4. Handle ```handleTimeoutException``` in GlobalExceptionHandler.
21. Implement AppConfig
    ```java
    @Configuration
    public class AppConfig {

    @Bean
    @Primary
    public ChatModel openAiChatModel() {
        return new OpenAiChatModel();
    }

    @Bean(name = "springAiOLlamaChatModel")
    public ChatModel ollamaChatModel() {
        return new OllamaChatModel();
    }
    }
    ```
22. Implement Recipe Service
    ```java
        public Mono<RecipeResponse> createRecipe(String ingredients, String cuisine, String dietaryRestrictions, ChatModel chatModel) {
        return Mono.fromCallable(() -> {
             try {
                 String template =
                 """
                 Create a recipe based on the following details:
                 Ingredients: {ingredients}
                 Cuisine: {cuisine}
                 Dietary Restrictions: {dietaryRestrictions}
                 {format}
                 """;

                BeanOutputConverter<RecipeResponse> recipeResponseBeanOutputConverter =
                        new BeanOutputConverter<>(RecipeResponse.class);
                String format = recipeResponseBeanOutputConverter.getFormat();

                Map<String, Object> templateModel = new HashMap<>();
                templateModel.put("ingredients", ingredients);
                templateModel.put("cuisine", cuisine);
                templateModel.put("dietaryRestrictions", dietaryRestrictions);
                templateModel.put("format", format);

                PromptTemplate promptTemplate = new PromptTemplate(template, templateModel);
                Prompt prompt = promptTemplate.create();
                Generation generation = chatModel.call(prompt).getResult();
                return recipeResponseBeanOutputConverter.convert(generation.getOutput().getContent());
            } catch (Exception e) {
                System.out.println("Error occurred while processing chat prompt: '{}'" + e);
                throw new RuntimeException(e.getMessage(), e);
            }
        }).subscribeOn(Schedulers.boundedElastic());
    }
    ```
23. Implement Diet Service
    ```java
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
    ```
24. Implement Exercise Service
    ```java
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
    ```
25. Generate Recipe Images
26. Generate Diet Images
27. Generate Exercise Images
```java
private CompletableFuture<TitleImage> generateTitleImage(String title) {
    return generateImage(title)
            .thenApply(imageData -> new TitleImage(title, imageData))
            .exceptionally(ex -> new TitleImage(title, getDefaultImage()));
}

private <T> CompletableFuture<List<T>> generateImagesForList(List<String> items, BiFunction<String, byte[], T> imageMapper) {
    List<CompletableFuture<T>> futures = items.stream()
            .map(item -> generateImage(item).thenApply(imageData -> imageMapper.apply(item, imageData)))
            .toList();

    return CompletableFuture.supplyAsync(() -> futures.stream()
            .map(CompletableFuture::join)
            .collect(Collectors.toList())
    );
}

private CompletableFuture<byte[]> generateImage(String prompt) {
    if (prompt == null || prompt.isEmpty()) {
        return CompletableFuture.completedFuture(getDefaultImage());
    }

    return CompletableFuture.supplyAsync(() -> {
        ImagePrompt imagePrompt = new ImagePrompt(prompt,
                StabilityAiImageOptions.builder()
                        .withModel(STABILITY_AI_MODEL)
                        .withN(NUMBER_OF_IMAGES)
                        .withHeight(IMAGE_DIMENSION)
                        .withWidth(IMAGE_DIMENSION)
                        .build());

        ImageResponse response = stabilityAiImageModel.call(imagePrompt);
        LoggerUtil.logInfo("generateMultipleImagesWithStabilityAi | response : " + response);
        return Base64.getDecoder().decode(response.getResults().get(0).getOutput().getB64Json());
    }).exceptionally(ex -> {
        LoggerUtil.logFailure("Error generating image for '" + prompt + "': " + ex.getMessage());
        throw new RuntimeException("Image generation failed for prompt: " + prompt, ex);
//            throw new ImageGenerationException("Image generation failed for prompt: " + prompt, ex);
    });
}
```
28. 
# License

The Hackathon Starter Kit is open source software [licensed as MIT][mlh-license].

[mlh-license]: https://github.com/thisismemukul/react_native_food_app/blob/main/LICENSE.md

============================================================================

## I'm a Web Developer, Graphic Designer, and Student!

### Let's Connect on [Linkedin][linkedin] 👋

- ⚡ My Portfolio 👇<br>
  ----> <a href="https://www.thisismemukul.ml/" target="_blank">Thisismemukul</a> (My Portfolio) <br>

### Connect with me:

[<img align="left" alt="Mukul Saini | Telegram" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/telegram.svg" />][telegram]
[<img align="left" alt="Mukul Saini | Instagram" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/instagram.svg" />][instagram]
[<img align="left" alt="Mukul Saini | Whatsapp" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/whatsapp.svg" />][whatsapp]
[<img align="left" alt="Mukul Saini | Linkedin" width="22px" src="https://cdn.jsdelivr.net/npm/simple-icons@v3/icons/linkedin.svg" />][linkedin]

<br />

### Languages and Tools:

<img align="left" alt="Visual Studio Code" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/visual-studio-code/visual-studio-code.png" />
<img align="left" alt="HTML5" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/html/html.png" />
<img align="left" alt="CSS3" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/css/css.png" />
<img align="left" alt="Sass" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/sass/sass.png" />
<img align="left" alt="JavaScript" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/javascript/javascript.png" />
<img align="left" alt="Git" width="26px" src="https://raw.githubusercontent.com/github/explore/80688e429a7d4ef2fca1e82350fe8e3517d3494d/topics/git/git.png" />
<img align="left" alt="GitHub" width="26px" src="https://raw.githubusercontent.com/github/explore/78df643247d429f6cc873026c0622819ad797942/topics/github/github.png" />
<br />
<br />

<p align="center"><img align="center" src="https://github-readme-stats.vercel.app/api/top-langs/?username=thisismemukul&layout=compact" alt="thisismemukul" /></p>

<br />

<p align="center"><img align="center" src="https://github-readme-stats.vercel.app/api/top-langs/?username=thisismemukul&theme=white-blue" alt="thisismemukul" /></p>

<br />

<p align="center">&nbsp;<img align="center" src="https://github-readme-stats.vercel.app/api?username=thisismemukul&show_icons=true" alt="thisismemukul" /></p>


---

[instagram]: https://instagram.com/thisismemukul
[telegram]: https://ttttt.me/thisismemukul
[whatsapp]: https://wa.me/918769506494
[linkedin]: https://www.linkedin.com/in/thisisme-mukulsaini
