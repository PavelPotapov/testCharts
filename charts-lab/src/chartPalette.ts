import { chartColors } from '@chart-lab/charts/theme';
import { catalog, type Kind, type Settings } from './catalog';

export type ColorSetting =
  | 'color'
  | 'secondary'
  | 'lineColor'
  | 'extraColor1'
  | 'extraColor2';
export interface PaletteEntry {
  label: string;
  paint: string;
  outline?: string;
  edit?: ColorSetting;
  visible?: boolean;
}

export function chartPalette(kind: Kind, s: Settings): PaletteEntry[] {
  const bothSeries = { ...s, showActual: true, showPlan: true };
  if (kind === 'line') {
    const colors = chartColors(s.theme, true);
    return catalog.line.props(bothSeries).series.map((row) => ({
      label: row.label,
      paint:
        row.color ?? (row.key === 'actual' ? colors.actual : colors.planStroke),
      edit:
        row.key === 'plan'
          ? 'secondary'
          : s.lineOverride
          ? 'lineColor'
          : undefined,
      visible: row.key === 'actual' ? s.showActual : s.showPlan,
    }));
  }
  if (kind === 'scatter') {
    return [
      { label: 'Точки', paint: catalog.scatter.props(s).color, edit: 'color' },
    ];
  }
  if (
    kind === 'pie' ||
    kind === 'treemap' ||
    kind === 'funnel' ||
    kind === 'radial'
  ) {
    if (kind === 'pie' && s.pieEmpty) return [];
    const { data } = catalog[kind].props(s);
    return data.map((row, i) => ({
      label: row.name,
      paint: row.color ?? chartColors(s.theme, true).actual,
      outline: 'strokeColor' in row ? row.strokeColor : undefined,
      edit: (['color', 'secondary', 'extraColor1', 'extraColor2'] as const)[i],
    }));
  }
  return catalog[kind].props(bothSeries).series.map((row) => {
    const isLine = 'kind' in row && row.kind === 'line';
    return {
      label: row.label,
      paint: isLine ? row.strokeColor ?? row.color : row.color,
      outline: isLine ? undefined : row.strokeColor,
      edit: row.key === 'actual' ? 'color' : 'secondary',
      visible: row.key === 'actual' ? s.showActual : s.showPlan,
    };
  });
}
