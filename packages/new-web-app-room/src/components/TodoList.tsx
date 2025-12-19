'use client';

import React, { useState, FormEvent } from 'react';

type Todo = { id: string; text: string; completed: boolean; };

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 't1', text: 'Sample task 1', completed: false },
    { id: 't2', text: 'Sample task 2', completed: false }
  ]);
  const [newTodo, setNewTodo] = useState('');

  const addTodo = () => {
    const text = newTodo.trim();
    if (!text) return;
    const todo: Todo = { id: Date.now().toString(), text, completed: false };
    setTodos([todo, ...todos]);
    setNewTodo('');
  };

  const toggle = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const remove = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Coops Todo List</h2>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          className="flex-1 px-3 py-2 border rounded"
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Create
        </button>
      </form>
      <ul className="space-y-2">
        {todos.map(t => (
          <li key={t.id} className="flex items-center justify-between">
            <span className={t.completed ? 'line-through' : ''}>{t.text}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => toggle(t.id)} className="px-2 py-1 bg-gray-200 rounded">Done</button>
              <button onClick={() => remove(t.id)} className="px-2 py-1 bg-red-200 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

