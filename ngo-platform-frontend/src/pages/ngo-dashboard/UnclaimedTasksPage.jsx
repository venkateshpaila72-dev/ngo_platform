import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Badge from '../../components/common/Badge.jsx';
import { listUnclaimedTasks } from '../../api/tasks.js';
import { NEED_TYPE_LABELS } from '../../constants/needTypes.js';
import { TASK_STATUS_LABELS } from '../../constants/statusLabels.js';
import { getTaskBadgeClass } from '../../utils/severityColors.js';

export default function UnclaimedTasksPage() {
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listUnclaimedTasks();
      setTasks(res.tasks);
    } catch (err) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DashboardLayout>
      <div className="px-6 sm:px-8 py-8 max-w-4xl mx-auto">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Unclaimed Tasks</h1>
        <p className="text-sm text-muted mb-6">
          Tasks with at least one dropped sub-task that still needs a replacement NGO.
        </p>

        {loading ? (
          <LoadingSpinner label="Loading tasks..." />
        ) : !tasks || tasks.length === 0 ? (
          <EmptyState
            title="Nothing unclaimed"
            subtitle="Every sub-task currently has an NGO assigned to it."
          />
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const droppedCount = task.sub_tasks.filter((st) => st.status === 'dropped').length;
              return (
                <Link
                  key={task.id}
                  to={`/dashboard/tasks/${task.id}`}
                  className="block bg-card border border-borderc rounded-xl p-5 hover:border-primary transition-colors"
                >
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <p className="font-heading font-semibold text-foreground">
                      {NEED_TYPE_LABELS[task.need_type] || task.need_type}
                      {task.total_quantity != null && ` \u2013 ${task.total_quantity} ${task.unit || ''}`}
                    </p>
                    <Badge color={getTaskBadgeClass(task.status)}>
                      {TASK_STATUS_LABELS[task.status] || task.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted">
                    {droppedCount} sub-task{droppedCount > 1 ? 's' : ''} dropped, unreassigned &middot;{' '}
                    {task.sub_tasks.length} total
                  </p>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}