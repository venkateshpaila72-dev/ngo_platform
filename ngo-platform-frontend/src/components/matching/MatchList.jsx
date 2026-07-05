import Badge from '../common/Badge.jsx';
import MatchScoreBar from './MatchScoreBar.jsx';

export default function MatchList({ matches, selected, onToggle }) {
  if (!matches || matches.length === 0) {
    return (
      <div className="bg-card border border-borderc rounded-xl p-6 text-center text-muted text-sm">
        No NGOs found within match radius for this need.
      </div>
    );
  }

  return (
    <div className="bg-card border border-borderc rounded-xl divide-y divide-borderc">
      {matches.map((m) => (
        <label
          key={m.ngo_id}
          className="flex items-center gap-4 px-4 py-4 cursor-pointer hover:bg-primary/5 transition-colors"
        >
          <input
            type="checkbox"
            checked={selected.has(m.ngo_id)}
            onChange={() => onToggle(m.ngo_id)}
            className="w-4 h-4 accent-primary shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-heading font-semibold text-foreground truncate">{m.ngo_name}</p>
              {!m.available && <Badge color="bg-warning text-white">Marked unavailable</Badge>}
            </div>
            <p className="text-xs text-muted mb-2">
              {m.district} - {m.distance_km} km away - skill {m.skill_weight}/100 - reliability {m.reliability_score}/100
            </p>
            <MatchScoreBar score={m.match_score} />
          </div>
        </label>
      ))}
    </div>
  );
}