import React from 'react';
import { AppLayout, AppSidebar, AppSidebarSection, AppSidebarItem } from '../components/ui/app-layout';
import { ChatInterface } from '../components/chat/ChatInterface';
import { PlusIcon, MessageCircleIcon, SettingsIcon, UserIcon, StarIcon, HistoryIcon, HelpCircleIcon } from 'lucide-react';
import { StylishButton } from '../components/ui/stylish-button';
import { QuickActions } from '../components/ui/chat-suggestions';

export default function Chat() {
  // Mock data for conversations
  const conversations = [
    { id: '1', title: 'Workout plans', date: '10 min ago', active: true },
    { id: '2', title: 'Healthy recipes', date: '2 hours ago', active: false },
    { id: '3', title: 'Productivity tips', date: 'Yesterday', active: false },
    { id: '4', title: 'Learning strategies', date: 'Sep 23', active: false },
  ];
  
  // Quick actions for the bottom of the sidebar
  const quickActions = [
    { 
      label: 'New Chat',
      icon: <PlusIcon className="h-5 w-5 text-primary" />,
      onClick: () => console.log('New chat')
    },
    { 
      label: 'Settings',
      icon: <SettingsIcon className="h-5 w-5 text-primary" />,
      onClick: () => console.log('Settings')
    },
    { 
      label: 'Profile',
      icon: <UserIcon className="h-5 w-5 text-primary" />,
      onClick: () => console.log('Profile')
    },
    { 
      label: 'Help',
      icon: <HelpCircleIcon className="h-5 w-5 text-primary" />,
      onClick: () => console.log('Help')
    }
  ];
  
  // Sidebar content
  const sidebarContent = (
    <AppSidebar>
      <div className="mb-6">
        <StylishButton
          variant="gradient"
          className="w-full flex items-center gap-2 justify-center"
        >
          <PlusIcon className="h-4 w-4" />
          New Conversation
        </StylishButton>
      </div>

      <AppSidebarSection title="Recent Conversations">
        {conversations.map((convo) => (
          <AppSidebarItem
            key={convo.id}
            active={convo.active}
            className="flex items-start py-3"
          >
            <div className="mr-2 mt-0.5">
              <MessageCircleIcon className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <p className="truncate font-medium">{convo.title}</p>
                {convo.active && (
                  <div className="ml-2 h-2 w-2 rounded-full bg-primary"></div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{convo.date}</p>
            </div>
          </AppSidebarItem>
        ))}
      </AppSidebarSection>
      
      <AppSidebarSection title="Favorites">
        <AppSidebarItem className="flex items-center gap-2">
          <StarIcon className="h-4 w-4 text-yellow-500" />
          Meal Planning
        </AppSidebarItem>
        <AppSidebarItem className="flex items-center gap-2">
          <StarIcon className="h-4 w-4 text-yellow-500" />
          Travel Suggestions
        </AppSidebarItem>
      </AppSidebarSection>
      
      <div className="mt-auto pt-4">
        <QuickActions actions={quickActions} />
      </div>
    </AppSidebar>
  );
  
  return (
    <AppLayout sidebar={sidebarContent}>
      <div className="h-full flex flex-col">
        <div className="mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Chat</h2>
          <p className="text-muted-foreground">
            Ask me anything or try one of the examples below.
          </p>
        </div>
        
        <ChatInterface className="flex-1" />
      </div>
    </AppLayout>
  );
} 