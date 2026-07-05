import Button from '../common/Button.jsx';
import MatchScoreBar from '../matching/MatchScoreBar.jsx';

export default function ReplacementSuggestions({ data, onReassign, busy }) {
  if (!data) return null;

  if (data.candidates_in_range === 0) {
    return (
      <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 text-sm text-foreground">
        {data.note || 'No NGOs currently available nearby.'}
      </div>
    );
  }

  return (
    <div className="bg-card border border-borderc rounded-xl divide-y divide-borderc">
      {data.suggestions.map((s) => (
        <div key={s.ngo_id} className="flex items-center gap-4 px-4 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground truncate">{s.ngo_name}</p>
            <p className="text-xs text-muted mb-1">
              {s.district} - {s.distance_km} km away
            </p>
            <MatchScoreBar score={s.match_score} />
          </div>
          <Button onClick={() => onReassign(s.ngo_id)} disabled={busy}>
            Assign
          </Button>
        </div>
      ))}
    </div>
  );
}