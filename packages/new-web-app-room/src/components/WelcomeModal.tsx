'use client';

import React from 'react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in fade-in duration-300">
        <div className="text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome to Collaborative Canvas!
          </h2>
          <p className="text-gray-600 mb-6">
            Draw, create, and collaborate with others in real-time. Your creativity has no limits!
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">🖱️</div>
            <div>
              <h3 className="font-semibold text-gray-800">Draw & Create</h3>
              <p className="text-sm text-gray-600">Use your mouse or touch to draw on the canvas</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">🎨</div>
            <div>
              <h3 className="font-semibold text-gray-800">Choose Tools</h3>
              <p className="text-sm text-gray-600">Select colors, brush sizes, and tools from the toolbar</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="text-2xl">👥</div>
            <div>
              <h3 className="font-semibold text-gray-800">Collaborate</h3>
              <p className="text-sm text-gray-600">See other users drawing in real-time with different colors</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Start Drawing! 🚀
        </button>
      </div>
    </div>
  );
}

