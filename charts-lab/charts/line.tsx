import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as Engine,
  Tooltip,
  XAxis,
  YAxis,
  matchByDataKey,
} from 'recharts';
import { Frame, animation, margin, useChartStyles } from './shared.js';
import type { CartesianProps, Series } from './shared.js';

import { ChartTooltip, type TooltipOptions } from './tooltip.js';

type LineSeries = Omit<Series, 'color'> & { color?: string; dash?: string };
export interface LineChartProps extends Omit<CartesianProps, 'series'> {
  series: LineSeries[];
  strokeWidth?: number;
  curve?: 'linear' | 'monotone' | 'step';
  dots?: boolean;
  dotRadius?: number;
  activeRadius?: number;
  hollowDots?: boolean;
  connectNulls?: boolean;
  tooltip?: TooltipOptions;
  legendPosition?: 'top' | 'bottom';
  animationKey?: string;
}

export function LineChart({
  data,
  categoryKey,
  series,
  title,
  height,
  motion,
  grid = true,
  strokeWidth = 3,
  curve = 'monotone',
  dots = false,
  dotRadius = 3,
  activeRadius = 5,
  hollowDots = false,
  connectNulls = false,
  tooltip,
  legendPosition,
  chartTheme,
  animationKey,
}: LineChartProps) {
  const styles = useChartStyles(chartTheme);
  const matchPoints = useMemo(
    () => (animationKey ? matchByDataKey(animationKey) : undefined),
    [animationKey]
  );
  const lineMotion = animation(motion);
  return (
    <Frame title={title} height={height} chartTheme={chartTheme}>
      <Engine data={data} margin={margin} aria-label={title}>
        {grid && (
          <CartesianGrid
            stroke={styles.gridStroke}
            strokeDasharray="3 5"
            vertical={false}
          />
        )}
        <XAxis {...styles.axis} dataKey={categoryKey} />
        <YAxis {...styles.axis} width={42} />
        <Tooltip
          isAnimationActive={lineMotion.isAnimationActive}
          cursor={{ fill: 'none', strokeDasharray: '3 3' }}
          content={(props) => <ChartTooltip {...props} options={tooltip} />}
        />
        {legendPosition && <Legend verticalAlign={legendPosition} />}
        {series.map((s) => (
          <Line
            key={s.key}
            dataKey={s.key}
            name={s.label}
            type={curve}
            stroke={s.color}
            strokeWidth={strokeWidth}
            strokeDasharray={s.dash}
            dot={
              dots
                ? {
                    r: dotRadius,
                    strokeWidth: hollowDots ? 2 : 0,
                    strokeDasharray: 'none',
                    ...(hollowDots ? { fill: styles.surface } : {}),
                  }
                : false
            }
            activeDot={
              activeRadius > 0
                ? {
                    r: activeRadius,
                    stroke: styles.surface,
                    strokeWidth: 2,
                    strokeDasharray: 'none',
                  }
                : false
            }
            connectNulls={connectNulls}
            animationMatchBy={matchPoints}
            {...lineMotion}
          />
        ))}
      </Engine>
    </Frame>
  );
}
