import { useId } from 'react';
import {
  Area,
  AreaChart as Engine,
  CartesianGrid,
  XAxis,
  YAxis,
  type CurveType,
} from 'recharts';
import {
  InteractiveTooltip,
  markerProps,
  type MarkerOptions,
} from './interactions.js';
import {
  cartesianDecoration,
  Frame,
  animation,
  margin,
  useChartStyles,
} from './shared.js';
import type { CartesianProps } from './shared.js';

export interface AreaChartProps extends CartesianProps, MarkerOptions {
  baseValue?: number | 'dataMin' | 'dataMax';
  gradient?: boolean;
  connectNulls?: boolean;
  valueLabels?: boolean;
  strokeWidth?: number;
  curve?: CurveType;
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
  tooltip,
  legendPosition,
  chartTheme,
  baseValue,
  gradient = false,
  connectNulls = false,
  valueLabels = false,
  axes,
  grid = true,
  strokeWidth = 3,
  curve = 'monotone',
  opacity = 0.2,
  stacked = false,
  ...markers
}: AreaChartProps) {
  const gradientId = useId();
  const styles = useChartStyles(chartTheme);
  const decoration = cartesianDecoration(styles, axes);
  return (
    <Frame
      legendPosition={legendPosition}
      legendItems={series}
      title={title}
      height={height}
      chartTheme={chartTheme}
    >
      <Engine data={data} margin={margin}>
        {grid && <CartesianGrid {...decoration.grid} />}
        <XAxis {...decoration.x} dataKey={categoryKey} />
        <YAxis {...decoration.y} width={42} />
        <InteractiveTooltip
          options={tooltip}
          motionEnabled={motion?.enabled !== false}
          cursor={{ fill: 'none', strokeDasharray: '3 3' }}
        />
        {gradient && (
          <defs>
            {series.map((s, i) => (
              <linearGradient
                key={s.key}
                id={gradientId + '-' + i}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor={s.color} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0.1} />
              </linearGradient>
            ))}
          </defs>
        )}
        {series.map((s, i) => (
          <Area
            {...markerProps(markers, styles.surface, motion?.enabled !== false)}
            key={s.key}
            dataKey={s.key}
            name={s.label}
            type={curve}
            stroke={s.strokeColor ?? s.color}
            strokeWidth={strokeWidth}
            fill={gradient ? `url(#${gradientId}-${i})` : s.color}
            baseValue={baseValue}
            connectNulls={connectNulls}
            label={valueLabels}
            strokeDasharray={s.dash}
            fillOpacity={opacity}
            stackId={stacked ? 'total' : undefined}
            {...animation(motion)}
          />
        ))}
      </Engine>
    </Frame>
  );
}
