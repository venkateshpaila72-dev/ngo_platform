import { useState } from 'react';
import Badge from '../common/Badge.jsx';
import SubTaskCard from './SubTaskCard.jsx';
import ReplacementSuggestions from './ReplacementSuggestions.jsx';
import ResolveWithGapButton from './ResolveWithGapButton.jsx';
import { TASK_STATUS_LABELS } from '../../constants/statusLabels.js';
import { getTaskBadgeClass } from '../../utils/severityColors.js';
import {
  dropSubtask,
  suggestReplacements,
  reassignSubtask,
  completeSubtask,
  resolveTaskWithGap,
} from '../../api/tasks.js';

export default function TaskDetail({ task, ngoNames, onTaskUpdate }) {
  const [busyNgoId, setBusyNgoId] = useState(null);
  const [suggestionsFor, setSuggestionsFor] = useState(null);
  const [suggestions, setSuggestions] = useState(null);

  const runAction = async (ngoId, fn) => {
    setBusyNgoId(ngoId);
    try {
      const updated = await fn();
      onTaskUpdate(updated);
      return updated;
    } finally {
      setBusyNgoId(null);
    }
  };

  const handleDrop = async (ngoId) => {
    await runAction(ngoId, () => dropSubtask(task.id, ngoId));
    setSuggestionsFor(ngoId);
    setSuggestions(null);
    const data = await suggestReplacements(task.id, ngoId);
    setSuggestions(data);
  };

  const handleComplete = (ngoId) => runAction(ngoId, () => completeSubtask(task.id, ngoId));

  const handleReassign = async (newNgoId) => {
    const droppedNgoId = suggestionsFor;
    await runAction(droppedNgoId, () => reassignSubtask(task.id, droppedNgoId, newNgoId));
    setSuggestionsFor(null);
    setSuggestions(null);
  };

  const handleResolveWithGap = () => runAction('gap', () => resolveTaskWithGap(task.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">
          {task.sub_tasks.length} sub-task{task.sub_tasks.length > 1 ? 's' : ''}
        </p>
        <Badge color={getTaskBadgeClass(task.status)}>
          {TASK_STATUS_LABELS[task.status] || task.status}
        </Badge>
      </div>

      <div className="space-y-3">
        {task.sub_tasks.map((st) => (
          <div key={st.ngo_id}>
            <SubTaskCard
              subTask={st}
              ngoName={ngoNames[st.ngo_id]}
              unit={task.unit}
              onDrop={handleDrop}
              onComplete={handleComplete}
              busy={busyNgoId === st.ngo_id}
            />
            {suggestionsFor === st.ngo_id && (
              <div className="mt-3 ml-4">
                <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">
                  Replacement suggestions
                </p>
                <ReplacementSuggestions
                  data={suggestions}
                  onReassign={handleReassign}
                  busy={busyNgoId === suggestionsFor}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {task.status === 'partially_covered' && (
        <div className="pt-2">
          <ResolveWithGapButton onResolve={handleResolveWithGap} busy={busyNgoId === 'gap'} />
        </div>
      )}
    </div>
  );
}