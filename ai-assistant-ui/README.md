# AI Assistant UI

A modern React TypeScript UI for the Spring AI Assistant backend application. This UI allows users to interact with the AI assistant through a clean, responsive interface.

## Features

- Chat with AI for general queries
- Generate recipes based on available ingredients
- Create personalized diet plans
- Design exercise routines based on fitness goals
- Generate images for recipes, diet plans, and exercise routines

## Tech Stack

- React 18 with TypeScript
- React Router v6 for routing
- Tailwind CSS for styling
- Headless UI and Heroicons for UI components
- Axios for API requests

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v14+) and npm
- The Spring AI Assistant backend running on `http://localhost:8080`

## Getting Started

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd ai-assistant-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal).

## Building for Production

To build the application for production:

```bash
npm run build
```

The build files will be located in the `dist` directory.

## Project Structure

```
ai-assistant-ui/
├── public/              # Static assets
├── src/
│   ├── api/             # API service functions
│   ├── assets/          # Application assets
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Main application pages
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component with routing
│   ├── index.css        # Global styles (Tailwind)
│   └── main.tsx         # React entry point
├── index.html           # HTML template
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Configuration

The application is configured to proxy API requests to the Spring backend. This is defined in the `vite.config.ts` file.

## API Integration

This UI connects to the Spring AI Assistant backend API endpoints:

- `/ask/ai/chat` - Chat with AI
- `/ask/ai/create/recipe` - Generate recipes
- `/ask/ai/create/diet/plan` - Create diet plans
- `/ask/ai/create/exercise/plan` - Design exercise routines
- `/ask/ai/generate/images/recipe` - Generate recipe images
- `/ask/ai/generate/images/diet` - Generate diet plan images
- `/ask/ai/generate/images/exercise` - Generate exercise images

## License

[MIT License](LICENSE) 