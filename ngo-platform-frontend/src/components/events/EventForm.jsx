import { useState } from 'react';
import Button from '../common/Button.jsx';
import { createEvent } from '../../api/events.js';

export default function EventForm({ onCreated }) {
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [radiusKm, setRadiusKm] = useState('10');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim() && lat !== '' && lng !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await createEvent({
        name: name.trim(),
        location: { lat: parseFloat(lat), lng: parseFloat(lng) },
        radiusKm: parseFloat(radiusKm) || 10,
        description: description.trim(),
      });
      setName('');
      setLat('');
      setLng('');
      setRadiusKm('10');
      setDescription('');
      onCreated?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-borderc rounded-xl p-6 space-y-4">
      <div>
        <p className="font-heading font-semibold text-foreground">Create event</p>
        <p className="text-sm text-muted mt-1">
          An event scopes the Needs list and Heatmap to a single venue and radius - useful for a
          one-off relief camp, distribution drive, or disaster response site.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1">
            Event name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-borderc px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1">
            Latitude
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
            Longitude
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
            Radius (km)
          </label>
          <input
            type="number"
            min="0.5"
            step="any"
            value={radiusKm}
            onChange={(e) => setRadiusKm(e.target.value)}
            className="w-full rounded-lg border border-borderc px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-muted uppercase tracking-wide mb-1">
            Description (optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-borderc px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <Button type="submit" loading={submitting} disabled={!canSubmit}>
        Create event
      </Button>
    </form>
  );
}