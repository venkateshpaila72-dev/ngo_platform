// Formats ISO timestamps (as stored by the backend's add_document helper,
// e.g. "2026-07-05T09:14:32.123456") into short, readable strings.

export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  const d = formatDate(isoString);
  const t = formatTime(isoString);
  return d && t ? `${d}, ${t}` : d || t;
}