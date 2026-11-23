import { useLayoutEffect, useRef, useState } from 'react';
import type { Settings } from './catalog';

export function PaintRow({
  paint,
  label,
  theme,
  onChange,
}: {
  paint: string;
  label: string;
  theme: Settings['theme'];
  onChange?: (hex: string) => void;
}) {
  const row = useRef<HTMLDivElement>(null);
  const [tokenValue, setTokenValue] = useState('');
  // The chart theme supplies a token with a HEX fallback, or a user-picked HEX.
  const variable = /^var\(\s*(--[\w-]+)\s*,\s*(#[\da-f]{6}(?:[\da-f]{2})?)\s*\)$/i.exec(
    paint
  );
  const token = variable?.[1];
  useLayoutEffect(() => {
    const value =
      token && row.current
        ? getComputedStyle(row.current).getPropertyValue(token).trim()
        : '';
    setTokenValue(/^#[\da-f]{6}([\da-f]{2})?$/i.test(value) ? value : '');
  }, [token, theme]);
  const hex = (variable ? tokenValue || variable[2] : paint)
    .toUpperCase()
    .replace(/^(#[\dA-F]{6})FF$/, '$1');
  return (
    <div className="paint-row" ref={row}>
      {onChange ? (
        <input
          type="color"
          aria-label={'Цвет «' + label + '»'}
          value={hex.slice(0, 7)}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <i
          className="paint-chip"
          aria-hidden="true"
          style={{ background: paint }}
        />
      )}
      {token ? (
        <code className="paint-token">{token}</code>
      ) : (
        <span className="paint-token">Вручную</span>
      )}
      <code className="paint-hex">{hex}</code>
    </div>
  );
}
