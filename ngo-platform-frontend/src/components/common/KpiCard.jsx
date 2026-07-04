export default function KpiCard({ label, value, accent = 'text-primary' }) {
  return (
    <div className="bg-card border border-borderc rounded-xl p-5">
      <p className="text-sm text-muted mb-1">{label}</p>
      <p className={`font-heading font-bold text-3xl ${accent}`}>{value}</p>
    </div>
  );
}