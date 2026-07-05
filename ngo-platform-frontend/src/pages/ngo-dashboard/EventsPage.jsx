import { useState } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout.jsx';
import EventForm from '../../components/events/EventForm.jsx';
import EventList from '../../components/events/EventList.jsx';
import { setEventActive } from '../../api/events.js';
import { useEventMode } from '../../context/EventModeContext.jsx';

export default function EventsPage() {
  const { events, refreshEvents, loading } = useEventMode();
  const [busyId, setBusyId] = useState(null);

  const handleToggle = async (eventId, active) => {
    setBusyId(eventId);
    try {
      await setEventActive(eventId, active);
      await refreshEvents();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="px-6 sm:px-8 py-8 max-w-3xl mx-auto">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Event Mode</h1>
        <p className="text-sm text-muted mb-6">
          Create a venue-scoped event to focus the Needs list and Heatmap on a single location.
          Pick the active event from the selector at the top of any dashboard page to enter Event
          Mode; pick "All areas" to go back to your full service area.
        </p>

        <div className="mb-8">
          <EventForm onCreated={refreshEvents} />
        </div>

        <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2">All events</p>

        {loading ? (
          <p className="text-sm text-muted">Loading events...</p>
        ) : (
          <EventList events={events} onToggleActive={handleToggle} busyId={busyId} />
        )}
      </div>
    </DashboardLayout>
  );
}