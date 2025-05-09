import React, { useState, useEffect } from 'react';
import { ModernCard } from './modern-card';
import { XCircleIcon } from 'lucide-react';

// Global array to store API debug logs
let apiLogs: ApiLogEntry[] = [];

// Subscribers that will be notified when logs change
const subscribers: Set<(logs: ApiLogEntry[]) => void> = new Set();

// Function to add a log entry
export const addApiLog = (entry: ApiLogEntry) => {
  apiLogs = [entry, ...apiLogs].slice(0, 20); // Keep only last 20 logs
  notifySubscribers();
};

// Function to notify subscribers
const notifySubscribers = () => {
  subscribers.forEach(callback => callback([...apiLogs]));
};

// Custom hook to subscribe to API logs
export const useApiLogs = () => {
  const [logs, setLogs] = useState<ApiLogEntry[]>([...apiLogs]);
  
  useEffect(() => {
    const handleLogsChange = (newLogs: ApiLogEntry[]) => {
      setLogs(newLogs);
    };
    
    subscribers.add(handleLogsChange);
    
    return () => {
      subscribers.delete(handleLogsChange);
    };
  }, []);
  
  return logs;
};

// Types
export interface ApiLogEntry {
  id: string;
  timestamp: string;
  type: 'request' | 'response' | 'error';
  method?: string;
  url?: string;
  status?: number;
  data?: any;
  error?: any;
}

// Component to display API logs
export const ApiDebug: React.FC<{className?: string}> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const logs = useApiLogs();
  
  if (!isVisible) {
    return (
      <button 
        className="fixed bottom-4 right-4 bg-[hsl(var(--vibrant-blue))] text-white px-3 py-1 rounded-full text-xs shadow-md z-50"
        onClick={() => setIsVisible(true)}
      >
        Show API Logs
      </button>
    );
  }
  
  return (
    <div className={`fixed bottom-0 right-0 sm:bottom-4 sm:right-4 w-full sm:w-[500px] md:w-[600px] max-h-[80vh] z-50 ${className}`}>
      <ModernCard className="p-3 overflow-hidden rounded-t-lg sm:rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium">API Debug Logs</h3>
          <button onClick={() => setIsVisible(false)}>
            <XCircleIcon className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-3rem)]">
          {logs.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">No API logs yet</div>
          ) : (
            logs.map(log => (
              <div key={log.id} className="mb-2 text-xs">
                <div className={`p-2 rounded-md ${getLogColor(log.type)}`}>
                  <div className="flex justify-between flex-wrap">
                    <span className="font-medium">
                      {log.type === 'request' && log.method && log.url && (
                        <>
                          {log.method} {log.url}
                        </>
                      )}
                      {log.type === 'response' && log.status && (
                        <>
                          Response: {log.status}
                        </>
                      )}
                      {log.type === 'error' && (
                        <>Error</>
                      )}
                    </span>
                    <span className="text-muted-foreground">{log.timestamp}</span>
                  </div>
                  
                  <details className="mt-1">
                    <summary className="cursor-pointer">Data</summary>
                    <pre className="mt-1 p-2 bg-background/50 rounded overflow-x-auto text-[10px] sm:text-xs">
                      {JSON.stringify(log.data || log.error, null, 2)}
                    </pre>
                  </details>
                </div>
              </div>
            ))
          )}
        </div>
      </ModernCard>
    </div>
  );
};

// Helper to get background color based on log type
const getLogColor = (type: string) => {
  switch (type) {
    case 'request':
      return 'bg-blue-50 dark:bg-blue-950/30';
    case 'response':
      return 'bg-green-50 dark:bg-green-950/30';
    case 'error':
      return 'bg-red-50 dark:bg-red-950/30';
    default:
      return 'bg-gray-50 dark:bg-gray-800/30';
  }
}; 