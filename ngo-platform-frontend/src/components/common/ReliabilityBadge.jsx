function getReliabilityColor(score) {
  if (score >= 80) return 'text-success';
  if (score >= 50) return 'text-warning';
  return 'text-critical';
}

export default function ReliabilityBadge({ score }) {
  if (score == null) return null;
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="text-muted">Reliability</span>
      <span className={`font-bold ${getReliabilityColor(score)}`}>{Math.round(score)}</span>
    </div>
  );
}