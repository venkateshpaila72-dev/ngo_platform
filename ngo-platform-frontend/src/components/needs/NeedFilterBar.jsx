import { NEED_TYPES, NEED_TYPE_LABELS } from '../../constants/needTypes.js';
import { NEED_STATUS_LABELS } from '../../constants/statusLabels.js';

export default function NeedFilterBar({ status, needType, onStatusChange, onNeedTypeChange }) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className="rounded-lg border border-borderc px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <option value="">All statuses</option>
        {Object.entries(NEED_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={needType}
        onChange={(e) => onNeedTypeChange(e.target.value)}
        className="rounded-lg border border-borderc px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
      >
        <option value="">All need types</option>
        {NEED_TYPES.map((type) => (
          <option key={type} value={type}>
            {NEED_TYPE_LABELS[type] || type}
          </option>
        ))}
      </select>
    </div>
  );
}