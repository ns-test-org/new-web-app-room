'use client';

import React, { useState, FormEvent } from 'react';

type Todo = { id: string; text: string; completed: boolean };

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 't1', text: 'Sample task 1', completed: false },
    { id: 't2', text: 'Sample task 2', completed: false },
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
    setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const remove = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addTodo();
  };

  return (
    <section className="w-full max-w-xl bg-white/70 dark:bg-white/10 backdrop-blur rounded-xl border border-black/10 dark:border-white/10 shadow-sm p-5">
      <h2 className="text-xl font-bold mb-4 text-center">Coops Todo List</h2>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          className="flex-1 px-3 py-2 border rounded bg-white/80 dark:bg-white/10"
          placeholder="Add a new todo..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Create
        </button>
      </form>

      <ul className="space-y-2">
        {todos.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-3">
            <button
              onClick={() => toggle(t.id)}
              className="text-left flex-1"
              aria-label={t.completed ? 'Mark as not done' : 'Mark as done'}
            >
              <span className={t.completed ? 'line-through opacity-60' : ''}>{t.text}</span>
            </button>
            <div className="flex items-center gap-2">
              <button onClick={() => toggle(t.id)} className="px-2 py-1 bg-gray-200 rounded">
                Done
              </button>
              <button onClick={() => remove(t.id)} className="px-2 py-1 bg-red-200 rounded">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

