// Severity: how bad a single need is.
// Status: where a need currently stands in the resolution pipeline.
// Task / sub-task status: where an assignment stands once NGOs are working it.
// All reuse the same theme colors so the whole app reads consistently:
// green = good/resolved, orange/amber = in progress or needs help,
// red = urgent/open/critical/dropped.

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

export const TASK_STATUS_STYLES = {
  in_progress: { badge: 'bg-warning text-white', hex: '#EA580C' },
  partially_covered: { badge: 'bg-critical text-white', hex: '#DC2626' },
  verified: { badge: 'bg-success text-white', hex: '#059669' },
  resolved_partial: { badge: 'bg-accent text-white', hex: '#D97706' },
};

export const SUBTASK_STATUS_STYLES = {
  assigned: { badge: 'bg-primary text-white', hex: '#0F766E' },
  accepted: { badge: 'bg-primary text-white', hex: '#0F766E' },
  pending_verification: { badge: 'bg-accent text-white', hex: '#D97706' },
  dropped: { badge: 'bg-critical text-white', hex: '#DC2626' },
  completed: { badge: 'bg-success text-white', hex: '#059669' },
};

export const PROOF_STATUS_STYLES = {
  pending_verification: { badge: 'bg-warning text-white', hex: '#EA580C' },
  approved: { badge: 'bg-success text-white', hex: '#059669' },
  rejected: { badge: 'bg-critical text-white', hex: '#DC2626' },
};

const FALLBACK = { badge: 'bg-muted text-white', hex: '#64748B' };

export const getSeverityBadgeClass = (severity) =>
  (SEVERITY_STYLES[severity] || FALLBACK).badge;

export const getSeverityHex = (severity) =>
  (SEVERITY_STYLES[severity] || FALLBACK).hex;

export const getStatusBadgeClass = (status) =>
  (STATUS_STYLES[status] || FALLBACK).badge;

export const getStatusHex = (status) => (STATUS_STYLES[status] || FALLBACK).hex;

export const getTaskBadgeClass = (status) =>
  (TASK_STATUS_STYLES[status] || FALLBACK).badge;

export const getTaskHex = (status) => (TASK_STATUS_STYLES[status] || FALLBACK).hex;

export const getSubtaskBadgeClass = (status) =>
  (SUBTASK_STATUS_STYLES[status] || FALLBACK).badge;

export const getSubtaskHex = (status) =>
  (SUBTASK_STATUS_STYLES[status] || FALLBACK).hex;

export const getProofBadgeClass = (status) =>
  (PROOF_STATUS_STYLES[status] || FALLBACK).badge;

export const getProofHex = (status) => (PROOF_STATUS_STYLES[status] || FALLBACK).hex;