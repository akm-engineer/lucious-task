import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskFormData } from '../types';

const STORAGE_KEY = 'task-dashboard-tasks';

function generateId(): string {
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((data: TaskFormData) => {
    const newTask: Task = {
      id: generateId(),
      ...data,
      status: 'pending',
      order: Date.now(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, data: Partial<TaskFormData>) => {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, ...data } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleStatus = useCallback((id: string) => {
    setTasks(prev =>
      prev.map(t => {
        if (t.id !== id) return t;
        const completing = t.status === 'pending';
        return {
          ...t,
          status: completing ? 'completed' : 'pending',
          completedAt: completing ? new Date().toISOString() : undefined,
        };
      }),
    );
  }, []);

  const reorderTasks = useCallback((reordered: Task[]) => {
    setTasks(reordered);
  }, []);

  return { tasks, addTask, updateTask, deleteTask, toggleStatus, reorderTasks };
}
