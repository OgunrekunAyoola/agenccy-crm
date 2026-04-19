'use client';

import { useState } from 'react';
import { useTasks, Task } from '@/hooks/queries/useTasks';
import { useProjects } from '@/hooks/queries/useProjects';
import { useTimeTracking } from '@/hooks/queries/useTimeTracking';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Container, Section } from '@/components/ui/LayoutPrimitives';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'sonner';
import { ErrorState } from '@/components/ui/StateVisuals';
import { EmptyState } from '@/components/ui/EmptyState';
import { Clock, Plus, CheckSquare } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from 'react-i18next';

// ─── Column config ────────────────────────────────────────────────────────────
const COLUMN_DEFS = [
  { id: 'Todo', tKey: 'columns.todo', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  { id: 'InProgress', tKey: 'columns.inProgress', color: 'bg-blue-50 text-blue-700 border-blue-100' },
  { id: 'Done', tKey: 'columns.completed', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
] as const;

export default function TasksPage() {
  const { t } = useTranslation('tasks');
  const { tasks, isLoading, error, createTask, isCreating } = useTasks();
  const { projects } = useProjects();
  const { logTime, isLoggingTime } = useTimeTracking();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [selectedTaskForTime, setSelectedTaskForTime] = useState<Task | null>(null);

  const [newTask, setNewTask] = useState({ title: '', description: '', projectId: '' });
  const [newTime, setNewTime] = useState({
    hours: 1,
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  // ─── Derived helpers ───────────────────────────────────────────────────────
  const projectOptions = [
    { label: 'No project (standalone)', value: '' },
    ...projects.map((p) => ({ label: p.name, value: p.id })),
  ];

  const getProjectName = (projectId?: string): string => {
    if (!projectId) return '—';
    return projects.find((p) => p.id === projectId)?.name ?? '—';
  };

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    try {
      await createTask(newTask);
      toast.success('Task created successfully.');
      setNewTask({ title: '', description: '', projectId: '' });
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to create task. Please try again.');
    }
  };

  const handleLogTime = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskForTime) return;
    try {
      await logTime({
        projectId: selectedTaskForTime.projectId ?? '',
        taskId: selectedTaskForTime.id,
        ...newTime,
      });
      setIsTimeModalOpen(false);
      setSelectedTaskForTime(null);
      setNewTime({ hours: 1, description: '', date: new Date().toISOString().split('T')[0] });
      toast.success('Time logged successfully.');
    } catch {
      toast.error('Failed to log time. Please try again.');
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <Container>
      <Section className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('heading')}</h1>
          <p className="text-muted-foreground mt-1">{t('description')}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> {t('addButton')}
        </Button>
      </Section>

      {error && <ErrorState reset={() => window.location.reload()} />}
      {!error && !isLoading && tasks.length === 0 && (
        <EmptyState
           icon={CheckSquare}
           title={t('empty.title')}
           description={t('empty.description')}
           action={<Button onClick={() => setIsModalOpen(true)} className="gap-2"><Plus className="w-4 h-4" /> {t('empty.button')}</Button>}
        />
      )}

      {/* ── Kanban Board ─────────────────────────────────────────────── */}
      <Section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[400px] w-full bg-muted/20 animate-pulse rounded-xl border-2 border-dashed"
            />
          ))
        ) : tasks.length > 0 && (
          COLUMN_DEFS.map((column) => {
            const columnTasks = tasks.filter((task) => (task.status || 'Todo') === column.id);
            return (
              <div key={column.id} className="flex flex-col gap-4">
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border ${column.color}`}
                >
                  <h3 className="font-bold text-sm uppercase tracking-wider">{t(column.tKey)}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/50">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="flex flex-col gap-3 min-h-[500px]">
                  {columnTasks.map((task) => (
                    <div
                      key={task.id}
                      className="group bg-surface p-4 rounded-xl border border-border shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-primary/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate max-w-[120px]">
                          {getProjectName(task.projectId)}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSelectedTaskForTime(task);
                              setIsTimeModalOpen(true);
                            }}
                            className="p-1 hover:bg-primary-subtle text-primary rounded-md transition-colors"
                            title="Log Hours"
                            aria-label={`Log hours for task: ${task.title}`}
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-semibold text-foreground mb-1">{task.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex -space-x-2">
                          <div
                            className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold"
                            title="Unassigned"
                          >
                            ?
                          </div>
                        </div>
                        <Badge
                          variant={task.priority === 'High' ? 'danger' : 'muted'}
                          size="sm"
                        >
                          {task.priority || 'Normal'}
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {columnTasks.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-xl opacity-30 capitalize">
                      <Plus className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">No {t(column.tKey)} tasks</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </Section>

      {/* ── Create Task Modal ─────────────────────────────────────────── */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="e.g. Implement login flow"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <Select
            label="Project"
            options={projectOptions}
            value={newTask.projectId}
            onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium leading-none">Description</label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Task details..."
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isCreating}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── Log Time Modal ────────────────────────────────────────────── */}
      <Modal
        isOpen={isTimeModalOpen}
        onClose={() => {
          setIsTimeModalOpen(false);
          setSelectedTaskForTime(null);
        }}
        title={`Log Hours: ${selectedTaskForTime?.title ?? ''}`}
      >
        <form onSubmit={handleLogTime} className="space-y-4">
          <Input
            label="Hours"
            type="number"
            step="0.5"
            min="0.5"
            value={newTime.hours}
            onChange={(e) => setNewTime({ ...newTime, hours: Number(e.target.value) })}
            required
          />
          <Input
            label="Date"
            type="date"
            value={newTime.date}
            onChange={(e) => setNewTime({ ...newTime, date: e.target.value })}
            required
          />
          <Input
            label="What did you do?"
            placeholder="Describe the work completed..."
            value={newTime.description}
            onChange={(e) => setNewTime({ ...newTime, description: e.target.value })}
            required
          />
          <Button type="submit" className="w-full" isLoading={isLoggingTime}>
            Save Entry
          </Button>
        </form>
      </Modal>
    </Container>
  );
}
