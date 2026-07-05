import { Link } from 'react-router-dom';
import { useEventMode } from '../../context/EventModeContext.jsx';

export default function EventModeBar() {
  const { events, selectedEventId, setSelectedEventId, selectedEvent } = useEventMode();
  const activeEvents = events.filter((e) => e.active);

  if (activeEvents.length === 0 && !selectedEventId) return null;

  return (
    <div
      className={`px-6 sm:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm border-b ${
        selectedEvent ? 'bg-accent/10 border-accent/30' : 'bg-card border-borderc'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-semibold text-foreground shrink-0">Event Mode</span>
        <select
          value={selectedEventId}
          onChange={(e) => setSelectedEventId(e.target.value)}
          className="rounded-lg border border-borderc bg-card px-2.5 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">All areas (no event)</option>
          {activeEvents.map((ev) => (
            <option key={ev.id} value={ev.id}>
              {ev.name}
            </option>
          ))}
        </select>
        {selectedEvent && (
          <span className="text-muted truncate hidden sm:inline">
            Needs &amp; heatmap scoped to a {selectedEvent.radius_km}km radius around this venue.
          </span>
        )}
      </div>
      <Link to="/dashboard/events" className="text-primary font-semibold hover:underline shrink-0">
        Manage events
      </Link>
    </div>
  );
}