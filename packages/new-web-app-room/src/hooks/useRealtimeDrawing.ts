'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface Point {
  x: number;
  y: number;
}

interface DrawingData {
  points: Point[];
  color: string;
  brushSize: number;
  tool: 'pen' | 'eraser';
  timestamp: number;
  userId: string;
}

interface RealtimeDrawingHook {
  drawings: DrawingData[];
  connectedUsers: number;
  isConnected: boolean;
  sendDrawing: (drawing: Omit<DrawingData, 'userId'>) => void;
  clearCanvas: () => void;
}

// Mock WebSocket implementation for demo purposes
// In a real app, you'd connect to a WebSocket server
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useRealtimeDrawing(_roomId: string = 'default-room'): RealtimeDrawingHook {
  const [drawings, setDrawings] = useState<DrawingData[]>([]);
  const [connectedUsers, setConnectedUsers] = useState(1);
  const [isConnected] = useState(true); // Always connected in demo mode
  const userIdRef = useRef<string>(`user-${Math.random().toString(36).substr(2, 9)}`);
  
  // Simulate other users drawing (for demo purposes)
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add drawings from "other users" to demonstrate real-time collaboration
      if (Math.random() < 0.1) { // 10% chance every 2 seconds
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Create a simple random drawing
        const points: Point[] = [];
        const startX = Math.random() * 600 + 100;
        const startY = Math.random() * 400 + 100;
        
        for (let i = 0; i < 10; i++) {
          points.push({
            x: startX + Math.sin(i * 0.5) * 30,
            y: startY + Math.cos(i * 0.5) * 30
          });
        }
        
        const mockDrawing: DrawingData = {
          points,
          color: randomColor,
          brushSize: Math.floor(Math.random() * 10) + 3,
          tool: 'pen',
          timestamp: Date.now(),
          userId: `demo-user-${Math.floor(Math.random() * 3) + 1}`
        };
        
        setDrawings(prev => [...prev, mockDrawing]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Simulate connected users count changing
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectedUsers(prev => {
        const change = Math.random() < 0.5 ? -1 : 1;
        const newCount = prev + change;
        return Math.max(1, Math.min(8, newCount)); // Keep between 1-8 users
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sendDrawing = useCallback((drawing: Omit<DrawingData, 'userId'>) => {
    const drawingWithUser: DrawingData = {
      ...drawing,
      userId: userIdRef.current
    };
    
    setDrawings(prev => [...prev, drawingWithUser]);
    
    // In a real implementation, you would send this to the WebSocket server:
    // websocket.send(JSON.stringify({ type: 'drawing', data: drawingWithUser }));
  }, []);

  const clearCanvas = useCallback(() => {
    setDrawings([]);
    
    // In a real implementation, you would send this to the WebSocket server:
    // websocket.send(JSON.stringify({ type: 'clear', roomId }));
  }, []);

  return {
    drawings,
    connectedUsers,
    isConnected,
    sendDrawing,
    clearCanvas
  };
}


