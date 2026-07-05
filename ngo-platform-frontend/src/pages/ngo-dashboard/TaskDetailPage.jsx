import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/common/DashboardLayout.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import TaskDetail from '../../components/tasks/TaskDetail.jsx';
import { getTask } from '../../api/tasks.js';
import { getNeed } from '../../api/needs.js';
import { listNgos } from '../../api/ngos.js';
import { NEED_TYPE_LABELS } from '../../constants/needTypes.js';

export default function TaskDetailPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [need, setNeed] = useState(null);
  const [ngoNames, setNgoNames] = useState({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const taskRes = await getTask(taskId);
      setTask(taskRes);
      const [needRes, ngosRes] = await Promise.all([
        getNeed(taskRes.need_id),
        listNgos(),
      ]);
      setNeed(needRes);
      setNgoNames(Object.fromEntries(ngosRes.ngos.map((n) => [n.id, n.name])));
    } catch (err) {
      setTask(null);
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <DashboardLayout>
      <div className="px-6 sm:px-8 py-8 max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/dashboard/needs')}
          className="text-sm font-semibold text-muted hover:text-primary mb-4"
        >
          &lt; Back to Needs
        </button>

        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Task detail</h1>

        {loading ? (
          <LoadingSpinner label="Loading task..." />
        ) : !task ? (
          <EmptyState
            title="Task not found"
            subtitle="It may have been removed, or the link is incorrect."
          />
        ) : (
          <>
            {need && (
              <p className="text-sm text-muted mb-6">
                {NEED_TYPE_LABELS[need.need_type] || need.need_type} need at{' '}
                {need.location.lat.toFixed(3)}, {need.location.lng.toFixed(3)}
              </p>
            )}
            <TaskDetail task={task} ngoNames={ngoNames} onTaskUpdate={setTask} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}