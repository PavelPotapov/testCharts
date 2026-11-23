import type { CSSProperties, ReactNode } from 'react';
import {
  RechartsThemeProvider,
  ResponsiveContainer,
  useRechartsTheme,
  type RechartsTheme,
} from 'recharts';

import { hoverStyles, type InteractiveTooltipOptions } from './interactions.js';
import { dataTokens, tableTokens } from './theme.js';

export type Row = Record<string, string | number | null>;
export interface Series {
  key: string;
  label: string;
  color: string;
  strokeColor?: string;
  dash?: string;
}
export interface Motion {
  enabled?: boolean;
  duration?: number;
  delay?: number;
  easing?: 'linear' | 'ease-in-out' | 'ease-out';
}
export interface FrameProps {
  height?: number;
  title: string;
  motion?: Motion;
  chartTheme?: RechartsTheme;
  tooltip?: InteractiveTooltipOptions;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
}
export interface AxesOptions {
  xVisible?: boolean;
  yVisible?: boolean;
  reverseX?: boolean;
  reverseY?: boolean;
  xSide?: 'top' | 'bottom';
  ySide?: 'left' | 'right';
  fontSize?: number;
  xAngle?: number;
  gridPattern?: string;
  gridDirection?: 'auto' | 'horizontal' | 'vertical' | 'both';
  gridWidth?: number;
}
export function cartesianDecoration(
  styles: ReturnType<typeof useChartStyles>,
  options: AxesOptions = {},
  vertical = false,
  horizontal = true
) {
  const tick = { ...styles.axis.tick, fontSize: options.fontSize ?? 12 };
  const direction = options.gridDirection ?? 'auto';
  return {
    x: {
      ...styles.axis,
      tick,
      hide: options.xVisible === false,
      reversed: options.reverseX,
      orientation: options.xSide,
      angle: options.xAngle,
      height: options.xAngle ? 48 : undefined,
    },
    y: {
      ...styles.axis,
      tick,
      hide: options.yVisible === false,
      reversed: options.reverseY,
      orientation: options.ySide,
    },
    grid: {
      stroke: styles.gridStroke,
      strokeDasharray: options.gridPattern ?? '3 5',
      strokeWidth: options.gridWidth,
      vertical: direction === 'auto' ? vertical : direction !== 'horizontal',
      horizontal: direction === 'auto' ? horizontal : direction !== 'vertical',
    },
  };
}
export interface CartesianProps extends FrameProps {
  data: Row[];
  categoryKey: string;
  axes?: AxesOptions;
  series: Series[];
  grid?: boolean;
}
export function Frame({
  title,
  height = 320,
  chartTheme,
  children,
  legendItems = [],
  legendPosition,
}: FrameProps & {
  children: ReactNode;
  legendItems?: { label: string; color?: string }[];
}) {
  const side = legendPosition === 'left' || legendPosition === 'right';
  const legend = legendPosition && legendItems.length > 0 && (
    <div
      aria-label="Легенда"
      className="chart-frame-legend"
      style={{
        display: 'flex',
        flexDirection: side ? 'column' : 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '4px 12px',
        fontSize: 13,
        padding: 4,
        maxWidth: side ? '32%' : undefined,
        overflowWrap: 'anywhere',
      }}
    >
      {legendItems.map((entry, i) => (
        <span key={i}>
          <i
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: 10,
              height: 5,
              marginRight: 4,
              background: entry.color,
            }}
          />
          {entry.label}
        </span>
      ))}
    </div>
  );
  const chart = (
    <div
      role="group"
      aria-label={title}
      style={{
        width: '100%',
        height,
        minWidth: 0,
        display: 'flex',
        flexDirection: side ? 'row' : 'column',
      }}
    >
      <style>{hoverStyles}</style>
      {(legendPosition === 'top' || legendPosition === 'left') && legend}
      <div style={{ flex: '1 1 0%', minWidth: 0, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
      {(legendPosition === 'bottom' || legendPosition === 'right') && legend}
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
    animationBegin: motion?.delay,
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
