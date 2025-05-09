import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../components/ui/app-layout';
import { StylishButton } from '../components/ui/stylish-button';
import { ModernCard } from '../components/ui/modern-card';
import { GlowingBorder } from '../components/ui/background-gradient';
import { BrainIcon, MessageCircleIcon, UtensilsIcon, DumbbellIcon, ScrollIcon } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      title: 'Interactive AI Chat',
      description: 'Engage in natural conversations with our advanced AI assistant for instant responses and guidance.',
      icon: <MessageCircleIcon className="h-8 w-8 text-primary" />,
      link: '/chat'
    },
    {
      title: 'Recipe Generation',
      description: 'Get personalized recipe suggestions based on your ingredients, dietary preferences, and nutritional goals.',
      icon: <UtensilsIcon className="h-8 w-8 text-primary" />,
      link: '/recipe'
    },
    {
      title: 'Diet Planning',
      description: 'Create custom diet plans tailored to your health goals, food preferences, and dietary restrictions.',
      icon: <ScrollIcon className="h-8 w-8 text-primary" />,
      link: '/diet-plan'
    },
    {
      title: 'Exercise Planning',
      description: 'Receive personalized workout routines designed to meet your fitness level and exercise goals.',
      icon: <DumbbellIcon className="h-8 w-8 text-primary" />,
      link: '/exercise-plan'
    },
  ];
  
  return (
    <AppLayout>
      <div className="py-12 md:py-24 max-w-5xl mx-auto">
        <section className="text-center mb-16">
          <div className="inline-block mb-4 p-2 bg-primary/10 rounded-full">
            <BrainIcon className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-gradient">Smart AI Assistant</span> <br/>
            for Your Daily Needs
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            A powerful AI assistant that helps you with conversations, recipes, diet planning, and exercise routines.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <StylishButton asChild size="lg" variant="gradient" className="shine-effect">
              <Link to="/chat">Start Chatting</Link>
            </StylishButton>
            <StylishButton asChild size="lg" variant="outline">
              <Link to="/recipe">Try Recipes</Link>
            </StylishButton>
          </div>
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {features.map((feature, index) => (
            <GlowingBorder key={feature.title} className="h-full">
              <Link to={feature.link}>
                <ModernCard 
                  className="h-full bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300"
                  hoverEffect={true}
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="mb-4 p-3 bg-primary/10 rounded-full w-fit">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground flex-1">{feature.description}</p>
                    <div className="mt-4 text-primary font-medium flex items-center gap-1">
                      Try It Now
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </ModernCard>
              </Link>
            </GlowingBorder>
          ))}
        </section>
        
        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Powered by Advanced AI Models</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our AI assistant leverages cutting-edge models from OpenAI, Anthropic and more to deliver accurate, helpful responses to your queries.
          </p>
        </section>
      </div>
    </AppLayout>
  );
} 