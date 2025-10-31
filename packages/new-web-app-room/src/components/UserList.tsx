'use client';

import React from 'react';

interface User {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
}

interface UserListProps {
  connectedUsers: number;
}

export default function UserList({ connectedUsers }: UserListProps) {
  // Generate mock users for demo
  const users: User[] = Array.from({ length: connectedUsers }, (_, i) => ({
    id: `user-${i + 1}`,
    name: i === 0 ? 'You' : `User ${i + 1}`,
    color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#a8e6cf', '#dda0dd'][i % 8],
    isActive: Math.random() > 0.3 // 70% chance of being active
  }));

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 min-w-[200px]">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
        👥 Online Users ({connectedUsers})
      </h3>
      <div className="space-y-2">
        {users.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <div 
              className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: user.color }}
            />
            <span className={`text-sm ${user.name === 'You' ? 'font-semibold text-blue-600' : 'text-gray-700'}`}>
              {user.name}
            </span>
            {user.isActive && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-600">drawing</span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500 space-y-1">
          <div>• Real-time collaboration</div>
          <div>• All changes sync instantly</div>
          <div>• Different colors show different users</div>
        </div>
      </div>
    </div>
  );
}
