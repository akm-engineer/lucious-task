# Licious

A polished task management dashboard built with React 19, TypeScript, and Tailwind CSS v4. Features drag-and-drop reordering, rich analytics, dark/light mode, and smooth animations throughout.

## Features

**CRUD** — Create, edit, delete, and toggle tasks
**Two view modes** — Card grid and compact list, switchable from the header
**Drag & drop** — Reorder tasks in both views via @dnd-kit
**Search & filter** — Filter by status (All / Pending / Completed) and priority (All / Low / Medium / High)
**Task detail panel** — Click any task to open a full detail modal with inline status toggle
**Analytics tab** — Completion rate ring, on-time productivity ring, 7-day activity chart, and weekly stats
**Dark / light mode** — System preference detected on first load, toggleable from the header
**Skeleton loading** — Placeholder UI while tasks and analytics initialize
**Edge case handling** — Empty title validation, duplicate task warning, past due-date warning, character limits with live counters
**Persistence** — Tasks and theme preference saved to localStorage
**Responsive** — Mobile-first layout, bottom-sheet modals on small screens

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion |
| Drag & Drop | @dnd-kit/core, @dnd-kit/sortable |
| Icons | Lucide React |

## Getting Started

bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Lint
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview

## Project Structure

The project uses a feature-based architecture to co-locate related components, hooks, and utilities.

src/
├── app/
│   ├── App.tsx             # Root — tabs, DnD context, modals
│   └── providers.tsx       # Context providers
├── core/
│   ├── hooks/
│   │   ├── useTasks.ts     # Task CRUD + localStorage persistence
│   │   └── useTheme.ts     # Dark/light mode toggle
│   └── types/
│       └── index.ts        # Shared TypeScript types
├── features/
│   ├── insights/
│   │   ├── components/
│   │   │   └── Analytics.tsx       # Rings, chart, KPI cards
│   │   └── views/
│   │       └── InsightsPage.tsx    # Analytics tab page
│   └── tasks/
│       ├── components/
│       │   ├── PriorityBadge.tsx   # Colored priority pill
│       │   ├── TaskCard.tsx        # Card view task item
│       │   ├── TaskDetailPanel.tsx # Task detail modal
│       │   ├── TaskForm.tsx        # Create / edit task modal
│       │   └── TaskListItem.tsx    # List view task item
│       ├── hooks/
│       │   ├── useTaskActions.ts   # Task mutation handlers
│       │   └── useTaskFilters.ts   # Search + filter logic
│       ├── utils/
│       │   └── taskHelpers.ts      # Sorting, date, and stat helpers
│       └── views/
│           ├── TaskGridView.tsx    # Card grid layout
│           ├── TaskListView.tsx    # Compact list layout
│           └── TasksPage.tsx       # Tasks tab page
├── shared/
│   ├── components/
│   │   ├── ConfirmDialog.tsx   # Delete confirmation modal
│   │   ├── Header.tsx          # App header, view toggle, theme toggle
│   │   ├── SearchFilter.tsx    # Search input + status/priority controls
│   │   └── StatsBar.tsx        # Total / Pending / Done stat cards
│   ├── hooks/
│   │   └── useDebounce.ts      # Debounce utility hook
│   └── skeletons/
│       ├── AnalyticsSkeleton.tsx
│       ├── StatsBarSkeleton.tsx
│       ├── TaskCardsSkeleton.tsx
│       └── TaskListSkeleton.tsx
├── styles/
│   └── index.css           # Tailwind config, global styles, mesh gradient
└── main.tsx

## Task Model

ts
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  status: 'pending' | 'completed';
  order: number;
  createdAt: string;
  completedAt?: string;
}