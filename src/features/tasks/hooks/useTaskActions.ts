import { useState } from 'react';
import type { Task, TaskFormData } from '../../../core/types';

interface TaskCrud {
  addTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: Partial<TaskFormData>) => void;
  deleteTask: (id: string) => void;
}

export function useTaskActions(tasks: Task[], { addTask, updateTask, deleteTask }: TaskCrud) {
  const [showForm,    setShowForm]    = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingId,  setDeletingId]  = useState<string | null>(null);
  const [detailTask,  setDetailTask]  = useState<Task | null>(null);

  const liveDetailTask = detailTask ? (tasks.find(t => t.id === detailTask.id) ?? null) : null;

  const openAddForm  = () => { setEditingTask(null); setShowForm(true); };
  const openEditForm = (task: Task) => { setEditingTask(task); setShowForm(true); };
  const closeForm    = () => { setShowForm(false); setEditingTask(null); };

  const handleFormSubmit = (data: TaskFormData) => {
    if (editingTask) updateTask(editingTask.id, data);
    else addTask(data);
    closeForm();
  };

  const handleDeleteConfirm = () => {
    if (deletingId) deleteTask(deletingId);
    setDeletingId(null);
  };

  return {
    showForm,
    editingTask,
    deletingId,
    setDeletingId,
    detailTask,
    setDetailTask,
    liveDetailTask,
    openAddForm,
    openEditForm,
    closeForm,
    handleFormSubmit,
    handleDeleteConfirm,
  };
}
