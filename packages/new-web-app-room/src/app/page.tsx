'use client';

import { useState, useEffect } from 'react';
import DrawingCanvas from '@/components/DrawingCanvas';
import UserList from '@/components/UserList';
import WelcomeModal from '@/components/WelcomeModal';

export default function Home() {
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Show welcome modal after a short delay
    const timer = setTimeout(() => {
      setShowWelcome(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎨 Collaborative Drawing Canvas
          </h1>
          <p className="text-lg text-gray-600">
            Draw, create, and collaborate in real-time with others!
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Drawing Canvas */}
          <div className="flex-1 flex justify-center">
            <DrawingCanvas 
              width={800} 
              height={600} 
              onUsersChange={setConnectedUsers}
            />
          </div>

          {/* Sidebar with User List */}
          <div className="lg:w-64 w-full flex justify-center lg:justify-start">
            <UserList connectedUsers={connectedUsers} />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>🖱️ Use your mouse or touch to draw on the canvas</p>
          <p>🎨 Choose different tools, colors, and brush sizes</p>
          <p>👥 See other users drawing in real-time</p>
        </div>
      </div>

      {/* Welcome Modal */}
      <WelcomeModal 
        isOpen={showWelcome} 
        onClose={() => setShowWelcome(false)} 
      />
    </div>
  );
}






