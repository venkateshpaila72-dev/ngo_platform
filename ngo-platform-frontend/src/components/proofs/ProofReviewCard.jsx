import { useState } from 'react';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import AnomalyFlagBadge from './AnomalyFlagBadge.jsx';
import { formatDateTime } from '../../utils/formatDate.js';
import { getProofBadgeClass } from '../../utils/severityColors.js';
import { PROOF_STATUS_LABELS } from '../../constants/statusLabels.js';

export default function ProofReviewCard({ proof, ngoName, onApprove, onReject }) {
  const [busy, setBusy] = useState(false);

  const runAction = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } finally {
      setBusy(false);
    }
  };

  const isPending = proof.status === 'pending_verification';

  return (
    <div className="bg-card border border-borderc rounded-xl overflow-hidden flex flex-col sm:flex-row">
      <a href={proof.photo_url} target="_blank" rel="noreferrer" className="sm:w-48 shrink-0">
        <img
          src={proof.photo_url}
          alt="Proof submission"
          className="w-full h-40 sm:h-full object-cover"
        />
      </a>

      <div className="flex-1 p-5 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <p className="font-heading font-semibold text-foreground truncate">
              {ngoName || proof.ngo_id}
            </p>
            <p className="text-xs text-muted">{formatDateTime(proof.created_at)}</p>
          </div>
          <Badge color={getProofBadgeClass(proof.status)}>
            {PROOF_STATUS_LABELS[proof.status] || proof.status}
          </Badge>
        </div>

        {proof.story_text && (
          <p className="text-sm text-foreground mb-2">{proof.story_text}</p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted mb-1">
          {proof.feedback_rating != null && <span>Rating: {proof.feedback_rating}/5</span>}
          {proof.distance_km != null && <span>{proof.distance_km}km from need site</span>}
        </div>

        {proof.anomaly_flagged && <AnomalyFlagBadge reason={proof.anomaly_reason} />}

        {isPending && (
          <div className="flex gap-3 mt-4">
            <Button
              variant="danger"
              loading={busy}
              onClick={() => runAction(() => onReject(proof.id))}
            >
              Reject
            </Button>
            <Button loading={busy} onClick={() => runAction(() => onApprove(proof.id))}>
              Approve
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}