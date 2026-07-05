import { useState, useMemo, useEffect } from 'react';
import Button from '../common/Button.jsx';

export default function SplitAssignForm({ need, selectedNgos, onSubmit, submitting }) {
  const hasQuantity = need?.quantity != null;
  const [quantities, setQuantities] = useState({});

  // Keep the quantity map in sync as the user checks/unchecks NGOs above.
  useEffect(() => {
    setQuantities((prev) => {
      const next = {};
      selectedNgos.forEach((n) => {
        next[n.ngo_id] = prev[n.ngo_id] ?? '';
      });
      return next;
    });
  }, [selectedNgos]);

  const total = useMemo(
    () => selectedNgos.reduce((sum, n) => sum + (parseFloat(quantities[n.ngo_id]) || 0), 0),
    [quantities, selectedNgos]
  );

  const handleChange = (ngoId, value) => {
    setQuantities((prev) => ({ ...prev, [ngoId]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const splits = selectedNgos.map((n) => ({
      ngo_id: n.ngo_id,
      quantity: hasQuantity ? parseFloat(quantities[n.ngo_id]) || 0 : null,
    }));
    onSubmit(splits);
  };

  if (selectedNgos.length === 0) return null;

  const totalsMatch = !hasQuantity || total === need.quantity;

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-borderc rounded-xl p-5 space-y-4">
      <p className="font-heading font-semibold text-foreground">
        Assign to {selectedNgos.length} NGO{selectedNgos.length > 1 ? 's' : ''}
      </p>

      {hasQuantity ? (
        <div className="space-y-3">
          {selectedNgos.map((n) => (
            <div key={n.ngo_id} className="flex items-center justify-between gap-3">
              <span className="text-sm text-foreground truncate">{n.ngo_name}</span>
              <div className="flex items-center gap-2 shrink-0">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={quantities[n.ngo_id] ?? ''}
                  onChange={(e) => handleChange(n.ngo_id, e.target.value)}
                  required
                  className="w-28 rounded-lg border border-borderc px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-xs text-muted w-14">{need.unit || ''}</span>
              </div>
            </div>
          ))}
          <p className={`text-xs font-medium ${totalsMatch ? 'text-success' : 'text-warning'}`}>
            Split total: {total} / {need.quantity} {need.unit || ''}
            {!totalsMatch && ' - coverage may be incomplete, you can still proceed'}
          </p>
        </div>
      ) : (
        <p className="text-sm text-muted">
          This need has no fixed quantity - each selected NGO will be assigned the full task.
        </p>
      )}

      <Button type="submit" loading={submitting} fullWidth>
        Confirm assignment
      </Button>
    </form>
  );
}