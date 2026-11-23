import {
  Area,
  AreaChart as Engine,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartTooltip } from './tooltip.js';
import { Frame, animation, margin, useChartStyles } from './shared.js';
import type { CartesianProps } from './shared.js';

export interface AreaChartProps extends CartesianProps {
  strokeWidth?: number;
  curve?: 'linear' | 'monotone' | 'step';
  opacity?: number;
  stacked?: boolean;
}
export function AreaChart({
  data,
  categoryKey,
  series,
  title,
  height,
  motion,
  chartTheme,
  grid = true,
  strokeWidth = 3,
  curve = 'monotone',
  opacity = 0.2,
  stacked = false,
}: AreaChartProps) {
  const styles = useChartStyles(chartTheme);
  return (
    <Frame title={title} height={height} chartTheme={chartTheme}>
      <Engine data={data} margin={margin}>
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
          cursor={{ fill: 'none' }}
          content={(props) => <ChartTooltip {...props} />}
        />
        {series.map((s) => (
          <Area
            key={s.key}
            dataKey={s.key}
            name={s.label}
            type={curve}
            stroke={s.strokeColor ?? s.color}
            strokeWidth={strokeWidth}
            fill={s.color}
            fillOpacity={opacity}
            stackId={stacked ? 'total' : undefined}
            {...animation(motion)}
          />
        ))}
      </Engine>
    </Frame>
  );
}
