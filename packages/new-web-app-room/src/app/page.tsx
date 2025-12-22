"use client";

import { useState, useEffect, useCallback } from 'react';

interface Position {
  x: number;
  y: number;
}

interface Ghost {
  position: Position;
  direction: string;
  color: string;
}

const BOARD_WIDTH = 19;
const BOARD_HEIGHT = 21;
const CELL_SIZE = 20;

// Simple wall layout (1 = wall, 0 = path with dot)
const WALLS = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1],
  [1,1,1,1,0,1,0,0,0,0,0,0,0,1,0,1,1,1,1],
  [1,1,1,1,0,1,0,1,1,0,1,1,0,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1],
  [1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1],
  [1,1,1,1,0,1,0,0,0,0,0,0,0,1,0,1,1,1,1],
  [1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
  [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

export default function Home() {
  const [pacmanPos, setPacmanPos] = useState<Position>({ x: 9, y: 15 });
  const [ghosts, setGhosts] = useState<Ghost[]>([
    { position: { x: 9, y: 9 }, direction: 'up', color: 'red' },
    { position: { x: 8, y: 9 }, direction: 'down', color: 'pink' },
    { position: { x: 10, y: 9 }, direction: 'left', color: 'cyan' },
    { position: { x: 9, y: 10 }, direction: 'right', color: 'orange' }
  ]);
  const [dots, setDots] = useState<boolean[][]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState('right');

  // Initialize dots
  useEffect(() => {
    const initialDots = WALLS.map(row => 
      row.map(cell => cell === 0)
    );
    setDots(initialDots);
  }, []);

  // Check if position is valid (not a wall)
  const isValidPosition = (x: number, y: number): boolean => {
    if (x < 0 || x >= BOARD_WIDTH || y < 0 || y >= BOARD_HEIGHT) return false;
    return WALLS[y][x] === 0;
  };

  // Move Pac-Man
  const movePacman = useCallback(() => {
    if (gameOver) return;

    setPacmanPos(prev => {
      let newX = prev.x;
      let newY = prev.y;

      switch (direction) {
        case 'up': newY--; break;
        case 'down': newY++; break;
        case 'left': newX--; break;
        case 'right': newX++; break;
      }

      // Wrap around screen
      if (newX < 0) newX = BOARD_WIDTH - 1;
      if (newX >= BOARD_WIDTH) newX = 0;

      if (isValidPosition(newX, newY)) {
        // Check if Pac-Man eats a dot
        if (dots[newY] && dots[newY][newX]) {
          setDots(prevDots => {
            const newDots = [...prevDots];
            newDots[newY] = [...newDots[newY]];
            newDots[newY][newX] = false;
            return newDots;
          });
          setScore(prevScore => prevScore + 10);
        }
        return { x: newX, y: newY };
      }
      return prev;
    });
  }, [direction, dots, gameOver]);

  // Move ghosts
  const moveGhosts = useCallback(() => {
    if (gameOver) return;

    setGhosts(prevGhosts => 
      prevGhosts.map(ghost => {
        const directions = ['up', 'down', 'left', 'right'];
        let newDirection = ghost.direction;
        let newX = ghost.position.x;
        let newY = ghost.position.y;

        // Randomly change direction sometimes
        if (Math.random() < 0.3) {
          newDirection = directions[Math.floor(Math.random() * 4)];
        }

        // Move in current direction
        switch (newDirection) {
          case 'up': newY--; break;
          case 'down': newY++; break;
          case 'left': newX--; break;
          case 'right': newX++; break;
        }

        // Check if new position is valid
        if (isValidPosition(newX, newY)) {
          return {
            ...ghost,
            position: { x: newX, y: newY },
            direction: newDirection
          };
        } else {
          // If hit wall, choose random direction
          return {
            ...ghost,
            direction: directions[Math.floor(Math.random() * 4)]
          };
        }
      })
    );
  }, [gameOver]);

  // Check collisions
  useEffect(() => {
    ghosts.forEach(ghost => {
      if (ghost.position.x === pacmanPos.x && ghost.position.y === pacmanPos.y) {
        setGameOver(true);
      }
    });
  }, [ghosts, pacmanPos]);

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      movePacman();
      moveGhosts();
    }, 200);

    return () => clearInterval(gameLoop);
  }, [movePacman, moveGhosts]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': setDirection('up'); break;
        case 'ArrowDown': setDirection('down'); break;
        case 'ArrowLeft': setDirection('left'); break;
        case 'ArrowRight': setDirection('right'); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Check win condition
  useEffect(() => {
    const remainingDots = dots.flat().filter(Boolean).length;
    if (remainingDots === 0 && dots.length > 0) {
      setGameOver(true);
    }
  }, [dots]);

  const resetGame = () => {
    setPacmanPos({ x: 9, y: 15 });
    setGhosts([
      { position: { x: 9, y: 9 }, direction: 'up', color: 'red' },
      { position: { x: 8, y: 9 }, direction: 'down', color: 'pink' },
      { position: { x: 10, y: 9 }, direction: 'left', color: 'cyan' },
      { position: { x: 9, y: 10 }, direction: 'right', color: 'orange' }
    ]);
    setScore(0);
    setGameOver(false);
    setDirection('right');
    const initialDots = WALLS.map(row => 
      row.map(cell => cell === 0)
    );
    setDots(initialDots);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="mb-4">
        <h1 className="text-4xl font-bold text-yellow-400 mb-2">Pac-Man</h1>
        <div className="text-xl">Score: {score}</div>
      </div>

      <div 
        className="relative bg-black border-2 border-blue-500"
        style={{
          width: BOARD_WIDTH * CELL_SIZE,
          height: BOARD_HEIGHT * CELL_SIZE
        }}
      >
        {/* Render maze */}
        {WALLS.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`absolute ${cell === 1 ? 'bg-blue-600' : 'bg-black'}`}
              style={{
                left: x * CELL_SIZE,
                top: y * CELL_SIZE,
                width: CELL_SIZE,
                height: CELL_SIZE
              }}
            />
          ))
        )}

        {/* Render dots */}
        {dots.map((row, y) =>
          row.map((hasDot, x) => (
            hasDot && (
              <div
                key={`dot-${x}-${y}`}
                className="absolute bg-white rounded-full"
                style={{
                  left: x * CELL_SIZE + CELL_SIZE / 2 - 2,
                  top: y * CELL_SIZE + CELL_SIZE / 2 - 2,
                  width: 4,
                  height: 4
                }}
              />
            )
          ))
        )}

        {/* Render Pac-Man */}
        <div
          className="absolute bg-yellow-400 rounded-full"
          style={{
            left: pacmanPos.x * CELL_SIZE + 2,
            top: pacmanPos.y * CELL_SIZE + 2,
            width: CELL_SIZE - 4,
            height: CELL_SIZE - 4
          }}
        />

        {/* Render ghosts */}
        {ghosts.map((ghost, index) => (
          <div
            key={index}
            className={`absolute rounded-t-full ${
              ghost.color === 'red' ? 'bg-red-500' :
              ghost.color === 'pink' ? 'bg-pink-400' :
              ghost.color === 'cyan' ? 'bg-cyan-400' :
              'bg-orange-400'
            }`}
            style={{
              left: ghost.position.x * CELL_SIZE + 2,
              top: ghost.position.y * CELL_SIZE + 2,
              width: CELL_SIZE - 4,
              height: CELL_SIZE - 4
            }}
          />
        ))}
      </div>

      {gameOver && (
        <div className="mt-4 text-center">
          <div className="text-2xl mb-2">
            {dots.flat().filter(Boolean).length === 0 ? 'You Win!' : 'Game Over!'}
          </div>
          <button
            onClick={resetGame}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Play Again
          </button>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-400">
        Use arrow keys to move Pac-Man
      </div>
    </div>
  );
}

