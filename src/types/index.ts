export type Priority = 'low' | 'medium' | 'high';
export type Status = 'pending' | 'completed';
export type FilterStatus = 'all' | 'pending' | 'completed';
export type FilterPriority = 'all' | 'low' | 'medium' | 'high';
export type ViewMode = 'list' | 'card';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  status: Status;
  order: number;
  createdAt: string;
  completedAt?: string;
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
}
