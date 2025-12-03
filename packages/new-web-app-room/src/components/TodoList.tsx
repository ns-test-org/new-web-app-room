'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun, Plus, Edit2, Trash2, Check, X } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  // Load todos and theme from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
      setTodos(parsedTodos);
    }
    
    // Initialize dark mode based on saved preference or system preference
    if (savedTheme !== null) {
      setDarkMode(JSON.parse(savedTheme));
    } else {
      // Check system preference if no saved preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Save theme to localStorage and apply to document
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Add keyboard shortcut for dark mode toggle (Ctrl/Cmd + D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        setDarkMode(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: Todo = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        createdAt: new Date()
      };
      setTodos([todo, ...todos]);
      setNewTodo('');
    }
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim() && editingId) {
      setTodos(todos.map(todo => 
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      ));
      setEditingId(null);
      setEditText('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  return (
    <div className={`min-h-screen transition-all duration-500 ease-in-out ${
      darkMode ? 'dark bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-3xl font-bold transition-colors duration-300 ${
              darkMode ? 'text-white drop-shadow-lg' : 'text-blue-900'
            }`}>
              Todo List
            </h1>
            <p className={`text-sm mt-1 transition-colors duration-300 ${
              darkMode ? 'text-gray-300' : 'text-blue-600'
            }`}>
              {totalCount > 0 ? `${completedCount} of ${totalCount} completed` : 'No todos yet'}
            </p>
          </div>
          
          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative p-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
              darkMode 
                ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700 shadow-lg' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200 shadow-md hover:shadow-lg'
            }`}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={`${darkMode ? 'Switch to light mode' : 'Switch to dark mode'} (Ctrl+D)`}
          >
            <div className="relative">
              {darkMode ? (
                <Sun size={20} className="animate-pulse" />
              ) : (
                <Moon size={20} className="animate-pulse" />
              )}
            </div>
          </button>
        </div>

        {/* Add Todo Form */}
        <div className={`rounded-lg p-4 mb-6 ${
          darkMode ? 'bg-gray-800' : 'bg-blue-100 shadow-md border border-blue-200'
        }`}>
          <div className="flex gap-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addTodo)}
              placeholder="Add a new todo..."
              className={`flex-1 px-4 py-3 rounded-lg border transition-colors duration-200 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-blue-300 text-blue-900 placeholder-blue-400 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
            />
            <button
              onClick={addTodo}
              disabled={!newTodo.trim()}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className={`text-center py-12 ${
              darkMode ? 'text-gray-400' : 'text-blue-500'
            }`}>
              <div className="text-4xl mb-4">📝</div>
              <p className="text-lg">No todos yet!</p>
              <p className="text-sm">Add your first task above to get started.</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`rounded-lg p-4 transition-all duration-200 ${
                  darkMode ? 'bg-gray-800' : 'bg-blue-50 shadow-md border border-blue-200'
                } ${todo.completed ? 'opacity-75' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {/* Complete Toggle */}
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
                      todo.completed
                        ? 'bg-green-500 border-green-500 text-white'
                        : darkMode
                        ? 'border-gray-600 hover:border-green-500'
                        : 'border-blue-300 hover:border-green-500'
                    }`}
                  >
                    {todo.completed && <Check size={14} />}
                  </button>

                  {/* Todo Text */}
                  <div className="flex-1">
                    {editingId === todo.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                          className={`flex-1 px-3 py-2 rounded border transition-colors duration-200 ${
                            darkMode 
                              ? 'bg-gray-700 border-gray-600 text-white' 
                              : 'bg-white border-blue-300 text-blue-900'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20`}
                          autoFocus
                        />
                        <button
                          onClick={saveEdit}
                          className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded transition-colors duration-200"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded transition-colors duration-200"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span
                          className={`${
                            todo.completed 
                              ? `line-through ${darkMode ? 'text-gray-500' : 'text-blue-400'}` 
                              : darkMode ? 'text-white' : 'text-blue-900'
                          }`}
                        >
                          {todo.text}
                        </span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEdit(todo.id, todo.text)}
                            className={`p-2 rounded transition-colors duration-200 ${
                              darkMode 
                                ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' 
                                : 'text-blue-500 hover:text-blue-600 hover:bg-blue-100'
                            }`}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className={`p-2 rounded transition-colors duration-200 ${
                              darkMode 
                                ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' 
                                : 'text-blue-500 hover:text-red-600 hover:bg-blue-100'
                            }`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        {todos.length > 0 && (
          <div className={`mt-8 text-center text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            <div className="flex justify-center gap-6">
              <span>Total: {totalCount}</span>
              <span>Completed: {completedCount}</span>
              <span>Remaining: {totalCount - completedCount}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



















