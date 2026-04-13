import { AnimatePresence } from 'framer-motion';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../../core/types';
import { TaskListItem } from '../components/TaskListItem';

interface SortableRowProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
}

function SortableRow({ task, onToggle, onEdit, onDelete, onOpen }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : undefined,
        position: 'relative',
      }}
    >
      <TaskListItem
        task={task}
        isDragging={isDragging}
        dragHandleProps={{ ...attributes, ...listeners } as React.HTMLAttributes<HTMLDivElement>}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        onOpen={onOpen}
      />
    </div>
  );
}

interface TaskListViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onOpen: (task: Task) => void;
}

export function TaskListView({ tasks, onToggle, onEdit, onDelete, onOpen }: TaskListViewProps) {
  return (
    <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
      <div className="space-y-2">
        <AnimatePresence initial={false} mode="popLayout">
          {tasks.map(task => (
            <SortableRow
              key={task.id}
              task={task}
              onToggle={() => onToggle(task.id)}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
              onOpen={() => onOpen(task)}
            />
          ))}
        </AnimatePresence>
      </div>
    </SortableContext>
  );
}
