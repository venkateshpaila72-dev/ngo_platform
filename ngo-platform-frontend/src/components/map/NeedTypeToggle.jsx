import { NEED_TYPES, NEED_TYPE_LABELS } from '../../constants/needTypes.js';

export default function NeedTypeToggle({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('')}
        className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
          active === ''
            ? 'bg-primary text-white'
            : 'bg-card border border-borderc text-foreground hover:border-primary'
        }`}
      >
        All types
      </button>
      {NEED_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${
            active === type
              ? 'bg-primary text-white'
              : 'bg-card border border-borderc text-foreground hover:border-primary'
          }`}
        >
          {NEED_TYPE_LABELS[type] || type}
        </button>
      ))}
    </div>
  );
}