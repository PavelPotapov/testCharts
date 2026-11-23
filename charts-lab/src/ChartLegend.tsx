import { chartPalette } from './chartPalette';
import type { Kind, Settings } from './catalog';

export function ChartLegend({
  kind,
  settings,
}: {
  kind: Kind;
  settings: Settings;
}) {
  if (kind === 'line' || kind === 'scatter') return null;
  const entries = chartPalette(kind, settings).filter(
    (row) => row.visible !== false
  );
  if (!entries.length) return null;
  return (
    <div className="legend">
      {entries.map(({ label, paint }) => (
        <span key={label}>
          <i aria-hidden="true" style={{ background: paint }} />
          {label}
        </span>
      ))}
    </div>
  );
}
