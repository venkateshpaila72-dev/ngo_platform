import Badge from '../common/Badge.jsx';

export default function AnomalyFlagBadge({ reason }) {
  if (!reason) return null;

  return (
    <div className="mt-2">
      <Badge color="bg-critical text-white">Flagged for review</Badge>
      <p className="text-xs text-muted mt-1">{reason}</p>
    </div>
  );
}