import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { listEvents } from '../api/events.js';

const EventModeContext = createContext(null);

const STORAGE_KEY = 'ngo_platform_selected_event_id';

export function EventModeProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventIdState] = useState(
    () => localStorage.getItem(STORAGE_KEY) || ''
  );
  const [loading, setLoading] = useState(true);

  const refreshEvents = useCallback(async () => {
    try {
      const data = await listEvents(false);
      setEvents(data.events || []);
    } catch (err) {
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshEvents();
  }, [refreshEvents]);

  const setSelectedEventId = (eventId) => {
    setSelectedEventIdState(eventId);
    if (eventId) {
      localStorage.setItem(STORAGE_KEY, eventId);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const selectedEvent = events.find((e) => e.id === selectedEventId) || null;

  // If the previously-selected event was deactivated or deleted, fall back
  // to "no event" rather than silently scoping the dashboard to a stale id.
  useEffect(() => {
    if (selectedEventId && !loading && !selectedEvent) {
      setSelectedEventId('');
    }
  }, [selectedEventId, loading, selectedEvent]);

  return (
    <EventModeContext.Provider
      value={{
        events,
        loading,
        selectedEventId,
        selectedEvent,
        setSelectedEventId,
        refreshEvents,
      }}
    >
      {children}
    </EventModeContext.Provider>
  );
}

export function useEventMode() {
  return useContext(EventModeContext);
}