import { useState } from 'react';
import Button from '../common/Button.jsx';
import { setEnRoute, clearEnRoute } from '../../api/logistics.js';

export default function EnRouteForm({ ngoId, enRoute, onUpdated }) {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [etaMinutes, setEtaMinutes] = useState('30');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = lat !== '' && lng !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await setEnRoute(
        ngoId,
        { lat: parseFloat(lat), lng: parseFloat(lng) },
        parseFloat(etaMinutes) || 30
      );
      setLat('');
      setLng('');
      onUpdated?.();
    } finally {
      setSubmitting(false);
    }
  };

  const handleClear = async () => {
    setSubmitting(true);
    try {
      await clearEnRoute(ngoId);
      onUpdated?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-card border border-borderc rounded-xl p-6 space-y-4">
      <p className="font-heading font-semibold text-foreground">Your travel status</p>

      {enRoute ? (
        <div className="space-y-3">
          <p className="text-sm text-foreground">
            Currently en route to{' '}
            <span className="font-semibold">
              {enRoute.destination.lat.toFixed(3)}, {enRoute.destination.lng.toFixed(3)}
            </span>{' '}
            - ETA {enRoute.eta_minutes} min.
          </p>
          <Button variant="ghost" onClick={handleClear} loading={submitting}>
            Clear travel status (arrived / cancelled)
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <p className="text-sm text-muted">
            Declare a destination and other NGOs heading nearby around the same time will show up
            as shared-transport suggestions below.
          </p>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                Destination lat
              </label>
              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                required
                className="w-full rounded-lg border border-borderc px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                Destination lng
              </label>
              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                required
                className="w-full rounded-lg border border-borderc px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1">
                ETA (minutes)
              </label>
              <input
                type="number"
                min="1"
                value={etaMinutes}
                onChange={(e) => setEtaMinutes(e.target.value)}
                required
                className="w-full rounded-lg border border-borderc px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <Button type="submit" loading={submitting} disabled={!canSubmit}>
            Declare en route
          </Button>
        </form>
      )}
    </div>
  );
}