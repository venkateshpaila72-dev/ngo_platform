export default function Badge({ children, color = 'bg-muted text-white' }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${color}`}>
      {children}
    </span>
  );
}