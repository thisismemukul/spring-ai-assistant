import React, { useState, useRef, useEffect } from 'react';
import { SendIcon, PlusCircleIcon, MicIcon, ImageIcon, AlertCircleIcon } from 'lucide-react';
import { AIMessage, UserMessage } from '../ui/ai-message';
import { ModernCard } from '../ui/modern-card';
import { StylishButton } from '../ui/stylish-button';
import { EnhancedInput } from '../ui/enhanced-input';
import { ChatSuggestions } from '../ui/chat-suggestions';
import { cn } from '@/utils/cn';
import { apiService, MODELS } from '../../services/api';
import { extractErrorMessage } from '../../utils/errorHandling';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  isError?: boolean;
}

interface ChatInterfaceProps {
  className?: string;
}

export function ChatInterface({ className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I assist you today?',
      role: 'assistant',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>(MODELS.OPEN_AI);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatSuggestions = [
    "What can you help me with?",
    "Create a workout plan for me",
    "Give me a healthy recipe",
    "Tell me about your features"
  ];
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    // Clear any previous errors
    setError(null);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Set typing indicator
    setIsTyping(true);
    
    try {
      // Call the actual API
      const response = await apiService.getAIChatResponse(inputValue, selectedModel);
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMsg = extractErrorMessage(error);
      setError(errorMsg);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMsg,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    handleSend();
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className={cn("flex flex-col h-[calc(100vh-8rem)]", className)}>
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md mb-4 flex items-center">
          <AlertCircleIcon className="h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      )}
      
      <div className="flex-1 overflow-y-auto px-2 pt-4 pb-2 space-y-4 scroll-smooth">
        {messages.map((message) => (
          message.role === 'user' ? (
            <UserMessage
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
            />
          ) : (
            <AIMessage
              key={message.id}
              content={message.content}
              timestamp={message.timestamp}
              useTypingEffect
              isError={message.isError === true}
            />
          )
        ))}
        
        {isTyping && (
          <AIMessage
            content=""
            thinking
          />
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {messages.length === 1 && (
        <div className="px-4 py-6">
          <ChatSuggestions
            suggestions={chatSuggestions}
            onSuggestionClick={handleSuggestionClick}
          />
        </div>
      )}
      
      <div className="p-4 border-t">
        <div className="mb-2 flex justify-end">
          <select 
            className="text-xs bg-[hsl(var(--vibrant-light-purple))] p-1 rounded-md border-none focus:ring-1 focus:ring-[hsl(var(--vibrant-blue))]"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
          >
            <option value={MODELS.OPEN_AI}>OpenAI</option>
            <option value={MODELS.O_LLAMA_AI}>Ollama</option>
          </select>
        </div>
        
        <ModernCard
          className="bg-card/50 backdrop-blur-sm"
          hoverEffect={false}
        >
          <div className="flex space-x-2">
            <div className="flex-1">
              <EnhancedInput
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                className="bg-transparent"
                disabled={isTyping}
                trailingIcon={
                  <div className="flex space-x-1">
                    <button className="p-1 rounded-full hover:bg-accent">
                      <MicIcon className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button className="p-1 rounded-full hover:bg-accent">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                }
              />
            </div>
            <StylishButton
              size="icon"
              variant={inputValue.trim() && !isTyping ? "gradient" : "ghost"}
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className={inputValue.trim() && !isTyping ? "shine-effect" : ""}
            >
              <SendIcon className="h-4 w-4" />
            </StylishButton>
          </div>
        </ModernCard>
        <div className="text-xs text-center mt-4 text-muted-foreground">
          AI Assistant may produce inaccurate information about people, places, or facts
        </div>
      </div>
    </div>
  );
} 