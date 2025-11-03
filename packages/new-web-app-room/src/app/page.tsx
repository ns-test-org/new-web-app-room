'use client';

import { useState } from 'react';

interface SuccessMessage {
  id: number;
  message: string;
  timestamp: Date;
}

export default function SystemMessagePOC() {
  const [messages, setMessages] = useState<SuccessMessage[]>([]);
  const [nextId, setNextId] = useState(1);

  const addSuccessMessage = (message: string) => {
    const newMessage: SuccessMessage = {
      id: nextId,
      message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    setNextId(prev => prev + 1);
  };

  const dismissMessage = (id: number) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const predefinedMessages = [
    "Operation completed successfully!",
    "Data saved successfully!",
    "User profile updated!",
    "File uploaded successfully!",
    "Settings saved!",
    "Email sent successfully!",
    "Payment processed successfully!",
    "Account created successfully!"
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            System Message POC
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Proof of concept for displaying success messages
          </p>
        </div>

        {/* Message Container - Fixed position for notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2 w-80">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-lg animate-in slide-in-from-right duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {/* Success Icon */}
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      {msg.message}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {/* Dismiss Button */}
                <button
                  onClick={() => dismissMessage(msg.id)}
                  className="flex-shrink-0 ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Control Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Success Messages
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {predefinedMessages.map((message, index) => (
              <button
                key={index}
                onClick={() => addSuccessMessage(message)}
                className="text-left p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg transition-colors"
              >
                <span className="text-sm text-green-800 dark:text-green-200">
                  {message}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Message History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Message History
          </h2>
          
          {messages.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No messages yet. Click a button above to test success messages.
            </p>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <svg
                      className="w-4 h-4 text-green-600 dark:text-green-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {msg.message}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {msg.timestamp.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
            >
              Clear All Messages
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

