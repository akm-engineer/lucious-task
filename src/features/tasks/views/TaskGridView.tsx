import { AnimatePresence } from 'framer-motion';
import { SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../../core/types';
import { TaskCard } from '../components/TaskCard';

interface SortableCardProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
}

function SortableCard({ task, onToggle, onEdit, onDelete, onOpen }: SortableCardProps) {
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
      <TaskCard
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

interface TaskGridViewProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onOpen: (task: Task) => void;
}

export function TaskGridView({ tasks, onToggle, onEdit, onDelete, onOpen }: TaskGridViewProps) {
  return (
    <SortableContext items={tasks.map(t => t.id)} strategy={rectSortingStrategy}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence initial={false} mode="popLayout">
          {tasks.map(task => (
            <SortableCard
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
