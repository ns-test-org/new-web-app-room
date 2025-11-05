'use client';

import { useState, useRef } from 'react';

export default function CowEmojiApp() {
  const [isPressed, setIsPressed] = useState(false);
  const [mooCount, setMooCount] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playMoo = () => {
    // Create audio context for the "moo" sound effect
    if (typeof window !== 'undefined') {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create a "moo" sound with frequency modulation
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.8);
      } catch (error) {
        console.log('Audio not supported');
      }
    }
  };

  const handleCowTap = () => {
    setIsPressed(true);
    setMooCount(prev => prev + 1);
    playMoo();
    
    // Reset the pressed state after animation
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-400 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-800 mb-2">🐄 Cow Tap App 🐄</h1>
        <p className="text-green-700 text-lg">Tap the cow to hear it moo!</p>
      </div>

      {/* Cow Emoji Button */}
      <div className="relative">
        <button
          onClick={handleCowTap}
          className={`
            text-9xl transition-all duration-150 ease-in-out
            hover:scale-110 active:scale-95 
            ${isPressed ? 'scale-95' : 'scale-100'}
            bg-white rounded-full p-8 shadow-2xl
            border-4 border-green-300 hover:border-green-400
            transform hover:rotate-2 active:rotate-0
          `}
          style={{
            filter: isPressed ? 'brightness(1.2)' : 'brightness(1)',
          }}
        >
          🐄
        </button>
        
        {/* Moo text animation */}
        {isPressed && (
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 animate-bounce">
            <span className="text-4xl font-bold text-green-800 bg-white px-4 py-2 rounded-full shadow-lg border-2 border-green-300">
              MOOO! 🗣️
            </span>
          </div>
        )}
      </div>

      {/* Moo Counter */}
      <div className="mt-12 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-6 border-4 border-green-300">
          <h2 className="text-2xl font-bold text-green-800 mb-2">Moo Counter</h2>
          <div className="text-6xl font-bold text-green-600">{mooCount}</div>
          <p className="text-green-700 mt-2">
            {mooCount === 0 && "Tap the cow to start!"}
            {mooCount === 1 && "First moo! 🎉"}
            {mooCount > 1 && mooCount < 10 && "Keep going! 🐄"}
            {mooCount >= 10 && mooCount < 50 && "Wow, that's a lot of moos! 🤩"}
            {mooCount >= 50 && "Moo master! 🏆"}
          </p>
        </div>
      </div>

      {/* Fun facts */}
      <div className="mt-8 text-center max-w-md">
        <p className="text-green-800 text-sm opacity-75">
          🌱 Fun fact: Cows say different things in different languages! 
          In English it's "moo", in French it's "meuh", and in Japanese it's "mō"!
        </p>
      </div>
    </div>
  );
}



