export default function ImpactStoryModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-card rounded-xl max-w-lg w-full overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={item.photo_url} alt="Impact" className="w-full h-64 object-cover" />
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase">
              {item.need_type}
            </span>
            {item.district && <span className="text-xs text-muted">{item.district}</span>}
          </div>
          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
            {item.ngo_name}
          </h3>
          <p className="text-foreground text-sm leading-relaxed">
            {item.impact_story || item.story_text || 'No story available yet for this task.'}
          </p>
          {item.quantity && (
            <p className="text-sm text-muted mt-3">
              Delivered: <span className="font-semibold text-foreground">{item.quantity} {item.unit || ''}</span>
            </p>
          )}
          <button
            onClick={onClose}
            className="mt-5 w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}