export default function EmptyState({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-4">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <span className="text-2xl">Empty</span>
      </div>
      <h3 className="font-heading font-semibold text-lg text-foreground mb-1">{title}</h3>
      {subtitle && <p className="text-muted text-sm max-w-sm">{subtitle}</p>}
    </div>
  );
}