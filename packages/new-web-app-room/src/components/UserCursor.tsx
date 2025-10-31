'use client';

import React from 'react';

interface UserCursorProps {
  x: number;
  y: number;
  color: string;
  userName: string;
  isDrawing: boolean;
}

export default function UserCursor({ x, y, color, userName, isDrawing }: UserCursorProps) {
  return (
    <div
      className="absolute pointer-events-none z-10 transition-all duration-100 ease-out"
      style={{
        left: x - 8,
        top: y - 8,
        transform: 'translate(-50%, -50%)'
      }}
    >
      {/* Cursor */}
      <div className="relative">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          className={`transition-transform duration-200 ${isDrawing ? 'scale-125' : 'scale-100'}`}
        >
          <path
            d="M0 0L16 6L6 8L4 16L0 0Z"
            fill={color}
            stroke="white"
            strokeWidth="1"
          />
        </svg>
        
        {/* Drawing indicator */}
        {isDrawing && (
          <div 
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping"
            style={{ backgroundColor: color }}
          />
        )}
      </div>
      
      {/* User name label */}
      <div 
        className="absolute top-4 left-4 px-2 py-1 rounded text-xs text-white font-medium whitespace-nowrap shadow-lg"
        style={{ backgroundColor: color }}
      >
        {userName}
      </div>
    </div>
  );
}
