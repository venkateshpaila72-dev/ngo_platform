// Severity: how bad a single need is.
// Status: where a need currently stands in the resolution pipeline.
// Both reuse the same theme colors so the whole app reads consistently:
// green = good/resolved, orange/amber = in progress or needs help,
// red = urgent/open/critical.

export const SEVERITY_STYLES = {
  low: { badge: 'bg-success text-white', hex: '#059669' },
  medium: { badge: 'bg-accent text-white', hex: '#D97706' },
  high: { badge: 'bg-warning text-white', hex: '#EA580C' },
  critical: { badge: 'bg-critical text-white', hex: '#DC2626' },
};

export const STATUS_STYLES = {
  open: { badge: 'bg-critical text-white', hex: '#DC2626' },
  assigned: { badge: 'bg-warning text-white', hex: '#EA580C' },
  resolved: { badge: 'bg-success text-white', hex: '#059669' },
  partially_resolved: { badge: 'bg-accent text-white', hex: '#D97706' },
};

const FALLBACK = { badge: 'bg-muted text-white', hex: '#64748B' };

export const getSeverityBadgeClass = (severity) =>
  (SEVERITY_STYLES[severity] || FALLBACK).badge;

export const getSeverityHex = (severity) =>
  (SEVERITY_STYLES[severity] || FALLBACK).hex;

export const getStatusBadgeClass = (status) =>
  (STATUS_STYLES[status] || FALLBACK).badge;

export const getStatusHex = (status) => (STATUS_STYLES[status] || FALLBACK).hex;