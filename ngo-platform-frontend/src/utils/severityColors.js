// Maps backend severity/status strings to Tailwind color classes.
export const severityColor = (severity) => {
  switch (severity) {
    case 'critical': return 'bg-critical text-white';
    case 'high': return 'bg-warning text-white';
    case 'medium': return 'bg-accent text-white';
    case 'low': return 'bg-success text-white';
    default: return 'bg-muted text-white';
  }
};

// Maps need/task status to a pin/badge color for the heatmap and dashboards.
export const statusColor = (status) => {
  switch (status) {
    case 'open':
    case 'in_progress':
      return 'bg-critical text-white';
    case 'assigned':
    case 'partially_covered':
      return 'bg-warning text-white';
    case 'resolved':
    case 'verified':
      return 'bg-success text-white';
    case 'partially_resolved':
    case 'resolved_partial':
      return 'bg-accent text-white';
    default:
      return 'bg-muted text-white';
  }
};