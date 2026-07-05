import { Link } from 'react-router-dom';
import Badge from '../common/Badge.jsx';
import EmptyState from '../common/EmptyState.jsx';
import { NEED_TYPE_LABELS } from '../../constants/needTypes.js';
import { NEED_STATUS_LABELS } from '../../constants/statusLabels.js';
import { getSeverityBadgeClass, getStatusBadgeClass } from '../../utils/severityColors.js';

export default function NeedsTable({ needs }) {
  if (!needs || needs.length === 0) {
    return (
      <EmptyState
        title="No needs found"
        subtitle="Upload survey data or adjust your filters to see results here."
      />
    );
  }

  return (
    <div className="overflow-x-auto bg-card border border-borderc rounded-xl">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-borderc text-left text-muted">
            <th className="px-4 py-3 font-semibold">Need Type</th>
            <th className="px-4 py-3 font-semibold">Severity</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Quantity</th>
            <th className="px-4 py-3 font-semibold">Location</th>
            <th className="px-4 py-3 font-semibold">Notes</th>
            <th className="px-4 py-3 font-semibold"></th>
          </tr>
        </thead>
        <tbody>
          {needs.map((need) => (
            <tr key={need.id} className="border-b border-borderc last:border-0">
              <td className="px-4 py-3 font-medium text-foreground">
                {NEED_TYPE_LABELS[need.need_type] || need.need_type}
              </td>
              <td className="px-4 py-3">
                <Badge color={getSeverityBadgeClass(need.severity)}>{need.severity}</Badge>
              </td>
              <td className="px-4 py-3">
                <Badge color={getStatusBadgeClass(need.status)}>
                  {NEED_STATUS_LABELS[need.status] || need.status}
                </Badge>
              </td>
              <td className="px-4 py-3 text-foreground">
                {need.quantity != null ? `${need.quantity} ${need.unit || ''}`.trim() : '-'}
              </td>
              <td className="px-4 py-3 text-muted">
                {need.location.lat.toFixed(3)}, {need.location.lng.toFixed(3)}
              </td>
              <td className="px-4 py-3 text-muted max-w-xs truncate">{need.raw_notes || '-'}</td>
              <td className="px-4 py-3 text-right">
                {need.status === 'open' && (
                  <Link
                    to={`/dashboard/match/${need.id}`}
                    className="font-semibold text-primary hover:underline whitespace-nowrap"
                  >
                    Match
                  </Link>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}