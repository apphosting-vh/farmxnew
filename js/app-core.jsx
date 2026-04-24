
// Farm Manager - Browser-Compatible Version
const { useState, useEffect, useMemo, useCallback } = React;

// Debounce helper — batches rapid calls into a single execution after `delay` ms
function _debounce(fn, delay) {
  let timer;
  return function(...args) { clearTimeout(timer); timer = setTimeout(() => fn.apply(this, args), delay); };
}

// Custom hook for localStorage persistence
// FIX #4: writes are debounced 400 ms — typing in any form no longer triggers
// a synchronous JSON.stringify + setItem on every character, eliminating the
// main-thread block that caused input lag with large datasets.
const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  // Stable debounced writer — created once per key, survives re-renders
  const debouncedWrite = React.useRef(
    _debounce((k, v) => {
      try { window.localStorage.setItem(k, JSON.stringify(v)); } catch {}
    }, 400)
  ).current;

  useEffect(() => {
    debouncedWrite(key, value);
  }, [key, value]);

  return [value, setValue];
};

// ── SVG Icon Library ──────────────────────────────────────────────────────────
// Minimalistic 24×24 stroke-based icons, strokeWidth=1.6, rounded caps/joins
