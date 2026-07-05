import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import { SUBTASK_STATUS_LABELS } from '../../constants/statusLabels.js';
import { getSubtaskBadgeClass } from '../../utils/severityColors.js';

export default function SubTaskCard({ subTask, ngoName, unit, onDrop, onComplete, busy }) {
  const { status, quantity, ngo_id: ngoId } = subTask;
  const isActive = status === 'assigned' || status === 'accepted';

  return (
    <div className="bg-card border border-borderc rounded-xl p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="font-heading font-semibold text-foreground truncate">{ngoName || ngoId}</p>
        <p className="text-xs text-muted mt-0.5">
          {quantity != null ? `${quantity} ${unit || ''}`.trim() : 'Full task'}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Badge color={getSubtaskBadgeClass(status)}>
          {SUBTASK_STATUS_LABELS[status] || status}
        </Badge>

        {isActive && (
          <>
            <Button variant="outline" onClick={() => onComplete(ngoId)} disabled={busy}>
              Mark complete
            </Button>
            <Button variant="ghost" onClick={() => onDrop(ngoId)} disabled={busy}>
              Drop
            </Button>
          </>
        )}
      </div>
    </div>
  );
}