import { useState, useMemo } from 'react';
import type { Task, FilterStatus, FilterPriority } from '../../../core/types';
import { useDebounce } from '../../../shared/hooks/useDebounce';

export function useTaskFilters(tasks: Task[]) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');

  const debouncedSearch = useDebounce(search, 200);

  const filteredTasks = useMemo(() => {
    const q = debouncedSearch.toLowerCase().trim();
    return tasks.filter(task => {
      if (filterStatus   !== 'all' && task.status   !== filterStatus)   return false;
      if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
      if (q && !task.title.toLowerCase().includes(q) && !task.description.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [tasks, debouncedSearch, filterStatus, filterPriority]);

  const hasFilters = search !== '' || filterStatus !== 'all' || filterPriority !== 'all';

  return { search, setSearch, filterStatus, setFilterStatus, filterPriority, setFilterPriority, filteredTasks, hasFilters };
}
