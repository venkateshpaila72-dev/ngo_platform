import { useState } from 'react';
import usePolling from '../../hooks/usePolling.js';
import { getSynergyAlerts } from '../../api/logistics.js';
import LoadingSpinner from '../common/LoadingSpinner.jsx';
import EmptyState from '../common/EmptyState.jsx';

const POLL_INTERVAL_MS = 15000;

export default function SynergyAlerts() {
  const [data, setData] = useState(null);

  usePolling(async () => {
    const res = await getSynergyAlerts();
    setData(res);
  }, POLL_INTERVAL_MS);

  if (data === null) {
    return <LoadingSpinner label="Checking for shared-transport matches..." />;
  }

  if (data.count === 0) {
    return (
      <EmptyState
        title="No shared-transport matches right now"
        subtitle="This refreshes automatically as NGOs declare their travel status."
      />
    );
  }

  return (
    <div className="space-y-3">
      {data.alerts.map((alert, i) => (
        <div key={i} className="bg-accent/10 border border-accent/30 rounded-xl p-4">
          <p className="text-sm text-foreground">{alert.message}</p>
          <p className="text-xs text-muted mt-1">
            {alert.destination_distance_km}km apart - arriving within{' '}
            {alert.arrival_time_diff_minutes} min of each other
          </p>
        </div>
      ))}
    </div>
  );
}