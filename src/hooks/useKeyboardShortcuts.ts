import { useEffect, useRef } from 'react';

/**
 * Registers window keydown handlers keyed by `KeyboardEvent.key` (e.g. 'Escape', 'ArrowLeft')
 * while `enabled` is true. Handlers always see the latest render's closures.
 */
export const useKeyboardShortcuts = (handlers: Record<string, () => void>, enabled = true) => {
  const handlersRef = useRef(handlers);
  handlersRef.current = handlers;

  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      handlersRef.current[e.key]?.();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enabled]);
};
