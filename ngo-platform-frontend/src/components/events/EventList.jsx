import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';

export default function EventList({ events, onToggleActive, busyId }) {
  if (!events || events.length === 0) {
    return <p className="text-sm text-muted">No events yet - create one above.</p>;
  }

  return (
    <div className="space-y-3">
      {events.map((ev) => (
        <div
          key={ev.id}
          className="bg-card border border-borderc rounded-xl p-4 flex items-center justify-between gap-4"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-heading font-semibold text-foreground truncate">{ev.name}</p>
              <Badge color={ev.active ? 'bg-success text-white' : 'bg-muted text-white'}>
                {ev.active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            <p className="text-xs text-muted mt-0.5">
              {ev.location.lat.toFixed(3)}, {ev.location.lng.toFixed(3)} - {ev.radius_km}km radius
            </p>
            {ev.description && <p className="text-sm text-muted mt-1">{ev.description}</p>}
          </div>

          <Button
            variant={ev.active ? 'ghost' : 'outline'}
            onClick={() => onToggleActive(ev.id, !ev.active)}
            disabled={busyId === ev.id}
          >
            {ev.active ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      ))}
    </div>
  );
}