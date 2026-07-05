import { useEffect, useState, useCallback } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout.jsx';
import CsvUploadForm from '../../components/needs/CsvUploadForm.jsx';
import NeedFilterBar from '../../components/needs/NeedFilterBar.jsx';
import NeedsTable from '../../components/needs/NeedsTable.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import { listNeeds } from '../../api/needs.js';
import { getEventNeeds } from '../../api/events.js';
import { useEventMode } from '../../context/EventModeContext.jsx';

export default function NeedsPage() {
  const { selectedEventId, selectedEvent } = useEventMode();
  const [needs, setNeeds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [needType, setNeedType] = useState('');

  const loadNeeds = useCallback(async () => {
    setLoading(true);
    try {
      if (selectedEventId) {
        // The event-scoped endpoint only returns open needs within the venue
        // radius and has no query params of its own, so filters are applied
        // client-side here to match the normal Needs page's behavior.
        const data = await getEventNeeds(selectedEventId);
        let filtered = data.needs;
        if (status) filtered = filtered.filter((n) => n.status === status);
        if (needType) filtered = filtered.filter((n) => n.need_type === needType);
        setNeeds(filtered);
      } else {
        const data = await listNeeds({ status, needType });
        setNeeds(data.needs);
      }
    } catch (err) {
      setNeeds([]);
    } finally {
      setLoading(false);
    }
  }, [status, needType, selectedEventId]);

  useEffect(() => {
    loadNeeds();
  }, [loadNeeds]);

  return (
    <DashboardLayout>
      <div className="px-6 sm:px-8 py-8 max-w-6xl mx-auto">
        <h1 className="font-heading font-bold text-2xl text-foreground mb-1">Needs</h1>
        <p className="text-sm text-muted mb-6">
          {selectedEvent
            ? `Showing open needs within ${selectedEvent.radius_km}km of "${selectedEvent.name}" only.`
            : 'Upload survey data and review reported needs across your service area.'}
        </p>

        <div className="mb-8">
          <CsvUploadForm onIngested={loadNeeds} />
        </div>

        <div className="mb-4">
          <NeedFilterBar
            status={status}
            needType={needType}
            onStatusChange={setStatus}
            onNeedTypeChange={setNeedType}
          />
        </div>

        {loading ? <LoadingSpinner label="Loading needs..." /> : <NeedsTable needs={needs} />}
      </div>
    </DashboardLayout>
  );
}