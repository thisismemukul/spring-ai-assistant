import React from 'react';
import { Alert, AlertTitle, AlertDescription } from './alert';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { cn } from '@/utils/cn';

interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
  animate?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title = 'Error',
  message, 
  className = '',
  animate = true
}) => {
  return (
    <Alert 
      variant="destructive" 
      className={cn(
        'my-4 border-destructive/30 shadow-sm',
        animate && 'animate-in slide-in-from-top-2 fade-in duration-300',
        className
      )}
    >
      <ExclamationTriangleIcon className="h-5 w-5" />
      <AlertTitle className="font-semibold">{title}</AlertTitle>
      <AlertDescription className="mt-1 text-destructive dark:text-destructive-foreground/90">
        {message}
      </AlertDescription>
    </Alert>
  );
};

export default ErrorMessage; 