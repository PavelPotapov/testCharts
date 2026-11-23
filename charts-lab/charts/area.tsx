import {
  Area,
  AreaChart as Engine,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Frame,
  animation,
  axis,
  gridColor,
  margin,
  tooltipStyle,
} from './shared.js';
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
  grid = true,
  strokeWidth = 3,
  curve = 'monotone',
  opacity = 0.2,
  stacked = false,
}: AreaChartProps) {
  return (
    <Frame title={title} height={height}>
      <Engine data={data} margin={margin}>
        {grid && (
          <CartesianGrid
            stroke={gridColor}
            strokeDasharray="3 5"
            vertical={false}
          />
        )}
        <XAxis {...axis} dataKey={categoryKey} />
        <YAxis {...axis} width={42} />
        <Tooltip contentStyle={tooltipStyle} />
        {series.map((s) => (
          <Area
            key={s.key}
            dataKey={s.key}
            name={s.label}
            type={curve}
            stroke={s.color}
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
