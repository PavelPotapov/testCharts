import type { CSSProperties, ReactNode } from 'react';
import {
  RechartsThemeProvider,
  ResponsiveContainer,
  useRechartsTheme,
  type RechartsTheme,
} from 'recharts';

import { dataTokens, tableTokens } from './theme.js';

export type Row = Record<string, string | number | null>;
export interface Series {
  key: string;
  label: string;
  color: string;
  strokeColor?: string;
}
export interface Motion {
  enabled?: boolean;
  duration?: number;
  easing?: 'linear' | 'ease-in-out' | 'ease-out';
}
export interface FrameProps {
  height?: number;
  title: string;
  motion?: Motion;
  chartTheme?: RechartsTheme;
}
export interface CartesianProps extends FrameProps {
  data: Row[];
  categoryKey: string;
  series: Series[];
  grid?: boolean;
}
export function Frame({
  title,
  height = 320,
  chartTheme,
  children,
}: FrameProps & { children: ReactNode }) {
  const chart = (
    <div
      role="group"
      aria-label={title}
      style={{ width: '100%', height, minWidth: 0 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
  return chartTheme ? (
    <RechartsThemeProvider value={chartTheme}>{chart}</RechartsThemeProvider>
  ) : (
    chart
  );
}
export function animation(motion?: Motion) {
  return {
    isAnimationActive: motion?.enabled === false ? false : ('auto' as const),
    animationDuration: motion?.duration ?? 650,
    animationEasing: motion?.easing ?? ('ease-out' as const),
  };
}
export const axis = {
  axisLine: false,
  tickLine: false,
  tickMargin: 9,
  tick: {
    fill: `var(--chart-axis, ${tableTokens.light.textDark})`,
    fontSize: 12,
  },
};
export const gridColor = `var(--chart-grid, ${tableTokens.light.borderColor})`;
export const margin = { top: 18, right: 18, bottom: 6, left: 2 };

const themedAxis = { ...axis, tick: { fontSize: 12 } };

type ChartStyles = {
  axis: typeof axis | typeof themedAxis;
  gridStroke: string | undefined;
  referenceStroke: string;
  bandFill: string;
  surface: CSSProperties['backgroundColor'];
  text: CSSProperties['color'];
};

export function useChartStyles(chartTheme?: RechartsTheme): ChartStyles {
  const inheritedTheme = useRechartsTheme();
  const theme = chartTheme ?? inheritedTheme;
  return {
    axis: theme ? themedAxis : axis,
    gridStroke: theme ? undefined : gridColor,
    referenceStroke: theme?.reference?.stroke ?? dataTokens.light['data-gray'],
    bandFill:
      typeof theme?.cursor?.fill === 'string' && theme.cursor.fill !== 'none'
        ? theme.cursor.fill
        : tableTokens.light.bgHeader,
    surface: theme?.chart?.backgroundColor ?? tableTokens.light.bgCell,
    text: theme?.typography?.color,
  };
}
