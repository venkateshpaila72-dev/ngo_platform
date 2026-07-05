export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  className = '',
  loading = false,
  disabled = false,
  onClick,
  fullWidth = false,
}) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg px-4 py-2.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    outline: 'border border-primary text-primary hover:bg-primary/5',
    ghost: 'text-muted hover:text-primary',
    danger: 'bg-critical text-white hover:bg-critical/90',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant] || variants.primary} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      {loading && (
        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}