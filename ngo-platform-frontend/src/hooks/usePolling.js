import { useEffect, useRef } from 'react';

/**
 * Repeatedly calls `callback` every `intervalMs`, firing immediately on mount.
 * Pass `enabled = false` to pause polling (e.g. once a task's chat is archived,
 * or once a synergy panel is off-screen) without unmounting the component.
 *
 * The callback ref is kept fresh each render so callers don't need to
 * useCallback/memoize it themselves.
 */
export default function usePolling(callback, intervalMs = 4000, enabled = true) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return undefined;

    let cancelled = false;
    const tick = async () => {
      if (!cancelled) await savedCallback.current();
    };

    tick();
    const id = setInterval(tick, intervalMs);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [intervalMs, enabled]);
}