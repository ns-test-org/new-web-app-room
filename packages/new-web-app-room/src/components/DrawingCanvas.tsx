'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useRealtimeDrawing } from '@/hooks/useRealtimeDrawing';

interface Point {
  x: number;
  y: number;
}

// DrawingData interface is used by the real-time hook
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface DrawingData {
  points: Point[];
  color: string;
  brushSize: number;
  tool: 'pen' | 'eraser';
  timestamp: number;
  userId: string;
}

interface DrawingCanvasProps {
  width?: number;
  height?: number;
  onUsersChange?: (count: number) => void;
}

export default function DrawingCanvas({ width = 800, height = 600, onUsersChange }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<Point[]>([]);
  const [color, setColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  
  // Use real-time collaboration hook
  const { drawings, connectedUsers, isConnected, sendDrawing, clearCanvas: clearRealtimeCanvas } = useRealtimeDrawing();

  // Notify parent component of user count changes
  useEffect(() => {
    onUsersChange?.(connectedUsers);
  }, [connectedUsers, onUsersChange]);

  // Get canvas context
  const getContext = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = getContext();
    if (!canvas || !ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Set initial canvas properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }, [width, height, getContext]);

  // Redraw all drawings
  const redrawCanvas = useCallback(() => {
    const ctx = getContext();
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Redraw all stored drawings
    drawings.forEach((drawing) => {
      if (drawing.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = drawing.tool === 'eraser' ? '#ffffff' : drawing.color;
      ctx.lineWidth = drawing.brushSize;
      ctx.globalCompositeOperation = drawing.tool === 'eraser' ? 'destination-out' : 'source-over';

      // Add slight transparency for other users' drawings to distinguish them
      const isOwnDrawing = drawing.userId?.startsWith('user-');
      if (!isOwnDrawing && drawing.tool !== 'eraser') {
        ctx.globalAlpha = 0.8;
      }

      ctx.moveTo(drawing.points[0].x, drawing.points[0].y);
      for (let i = 1; i < drawing.points.length; i++) {
        ctx.lineTo(drawing.points[i].x, drawing.points[i].y);
      }
      ctx.stroke();

      // Reset alpha
      ctx.globalAlpha = 1.0;
    });

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';
  }, [drawings, width, height, getContext]);

  // Redraw when drawings change
  useEffect(() => {
    redrawCanvas();
  }, [drawings, redrawCanvas]);

  // Get mouse/touch position relative to canvas
  const getEventPos = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      // Mouse event
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  }, []);

  // Start drawing
  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const pos = getEventPos(e);
    setIsDrawing(true);
    setCurrentPath([pos]);
  }, [getEventPos]);

  // Continue drawing
  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;

    const pos = getEventPos(e);
    setCurrentPath(prev => [...prev, pos]);

    // Draw current stroke in real-time
    const ctx = getContext();
    if (!ctx || currentPath.length === 0) return;

    ctx.beginPath();
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = brushSize;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';

    const lastPoint = currentPath[currentPath.length - 1];
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();

    ctx.globalCompositeOperation = 'source-over';
  }, [isDrawing, getEventPos, currentPath, color, brushSize, tool, getContext]);

  // Stop drawing
  const stopDrawing = useCallback(() => {
    if (!isDrawing || currentPath.length === 0) return;

    // Save the completed drawing and send to other users
    const newDrawing = {
      points: currentPath,
      color,
      brushSize,
      tool,
      timestamp: Date.now(),
    };

    sendDrawing(newDrawing);
    setCurrentPath([]);
    setIsDrawing(false);
  }, [isDrawing, currentPath, color, brushSize, tool, sendDrawing]);

  // Clear canvas
  const clearCanvas = useCallback(() => {
    clearRealtimeCanvas();
    const ctx = getContext();
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }, [width, height, getContext, clearRealtimeCanvas]);

  // Note: Undo functionality would need to be implemented with proper real-time sync
  // For now, we only have clear all functionality

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      {/* Connection Status */}
      <div className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm border">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium text-gray-700">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">👥 {connectedUsers} users online</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-md">
        {/* Tool Selection */}
        <div className="flex gap-2">
          <button
            onClick={() => setTool('pen')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              tool === 'pen'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            ✏️ Pen
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              tool === 'eraser'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            🧹 Eraser
          </button>
        </div>

        {/* Color Picker */}
        {tool === 'pen' && (
          <div className="flex items-center gap-2">
            <label htmlFor="color-picker" className="font-medium text-gray-700">
              Color:
            </label>
            <input
              id="color-picker"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-10 h-10 rounded-md border-2 border-gray-300 cursor-pointer"
            />
          </div>
        )}

        {/* Brush Size */}
        <div className="flex items-center gap-2">
          <label htmlFor="brush-size" className="font-medium text-gray-700">
            Size:
          </label>
          <input
            id="brush-size"
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-20"
          />
          <span className="text-sm text-gray-600 w-8">{brushSize}px</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="px-4 py-2 bg-red-500 text-white rounded-md font-medium hover:bg-red-600 transition-colors"
          >
            🗑️ Clear All
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className={`canvas-container border-2 border-gray-300 rounded-lg shadow-lg overflow-hidden relative ${isDrawing ? 'drawing-active' : ''}`}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="block cursor-crosshair touch-none"
          style={{ width: `${width}px`, height: `${height}px` }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {/* Drawing indicator overlay */}
        {isDrawing && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium animate-pulse">
            Drawing...
          </div>
        )}
      </div>

      {/* Status */}
      <div className="text-sm text-gray-600 text-center">
        <div>Tool: {tool === 'pen' ? '✏️ Pen' : '🧹 Eraser'} | 
        {tool === 'pen' && ` Color: ${color} |`} 
        Size: {brushSize}px</div>
        <div className="mt-1">Total drawings: {drawings.length} | Real-time collaboration active</div>
      </div>
    </div>
  );
}














