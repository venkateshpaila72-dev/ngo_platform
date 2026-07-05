// Threshold gradient (red -> amber -> green) with the numeric score always
// shown as text alongside the bar, never color alone. Width transitions
// smoothly on data change, no bounce.
export default function MatchScoreBar({ score }) {
  const pct = Math.max(0, Math.min(100, score));
  const color = pct >= 70 ? 'bg-success' : pct >= 40 ? 'bg-warning' : 'bg-critical';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-muted/20 overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-[width] duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-foreground w-12 text-right shrink-0">
        {pct.toFixed(1)}
      </span>
    </div>
  );
}