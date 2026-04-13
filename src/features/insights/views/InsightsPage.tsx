import { lazy, Suspense } from 'react';
import type { Task } from '../../../core/types';
import { AnalyticsSkeleton } from '../../../shared/skeletons/AnalyticsSkeleton';

const Analytics = lazy(() =>
  import('../components/Analytics').then(m => ({ default: m.Analytics })),
);

interface InsightsPageProps {
  tasks: Task[];
}

export function InsightsPage({ tasks }: InsightsPageProps) {
  return (
    <Suspense fallback={<AnalyticsSkeleton />}>
      <Analytics tasks={tasks} />
    </Suspense>
  );
}
