import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import VolunteerLayout from '../../components/common/VolunteerLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import Badge from '../../components/common/Badge.jsx';
import { getTasksForNgo } from '../../api/ngos.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { NEED_TYPE_LABELS } from '../../constants/needTypes.js';
import { getSubtaskBadgeClass } from '../../utils/severityColors.js';
import { SUBTASK_STATUS_LABELS } from '../../constants/statusLabels.js';

export default function VolunteerHome() {
  const { session } = useAuth();
  const [tasks, setTasks] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!session?.ngo_id) return;
    setLoading(true);
    try {
      const res = await getTasksForNgo(session.ngo_id, true);
      setTasks(res.tasks);
    } catch (err) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [session?.ngo_id]);

  useEffect(() => {
    load();
  }, [load]);

  const mySubTask = (task) => task.sub_tasks.find((st) => st.ngo_id === session?.ngo_id);

  return (
    <VolunteerLayout>
      <div className="px-6 sm:px-8 py-8 max-w-3xl mx-auto">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">
          Welcome{session?.name ? `, ${session.name}` : ''}
        </h1>
        <p className="text-sm text-muted mb-8">
          These are the tasks currently open for your NGO. Pick one up and submit proof once you've
          completed it.
        </p>

        {loading ? (
          <LoadingSpinner label="Loading your tasks..." />
        ) : !tasks || tasks.length === 0 ? (
          <EmptyState
            title="No open tasks"
            subtitle="Your NGO doesn't have any active tasks right now. Check back soon."
          />
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const subTask = mySubTask(task);
              if (!subTask) return null;
              const isPending = subTask.status === 'pending_verification';

              return (
                <div
                  key={task.id}
                  className="bg-card border border-borderc rounded-xl p-5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-heading font-semibold text-foreground truncate">
                      {NEED_TYPE_LABELS[task.need_type] || task.need_type}
                      {subTask.quantity != null && ` \u2013 ${subTask.quantity} ${task.unit || ''}`}
                    </p>
                    <div className="mt-1">
                      <Badge color={getSubtaskBadgeClass(subTask.status)}>
                        {SUBTASK_STATUS_LABELS[subTask.status] || subTask.status}
                      </Badge>
                    </div>
                  </div>

                  {isPending ? (
                    <span className="text-sm text-muted shrink-0">Awaiting review</span>
                  ) : (
                    <Link
                      to={`/volunteer/submit/${task.id}`}
                      className="shrink-0 inline-flex items-center justify-center font-semibold rounded-lg px-4 py-2.5 text-sm bg-primary text-white hover:bg-primary-dark transition-colors"
                    >
                      Submit proof
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </VolunteerLayout>
  );
}