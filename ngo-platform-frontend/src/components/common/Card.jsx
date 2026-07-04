import { useRef, useEffect } from 'react';
import { attachHoverLift } from '../../hooks/useScrollReveal.js';

export default function Card({ children, className = '', onClick, hoverLift = true }) {
  const ref = useRef(null);

  useEffect(() => {
    if (hoverLift) return attachHoverLift(ref.current);
  }, [hoverLift]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`bg-card border border-borderc rounded-xl shadow-sm transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}