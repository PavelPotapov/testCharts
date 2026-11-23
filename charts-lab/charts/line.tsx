import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as Engine,
  XAxis,
  YAxis,
  matchByDataKey,
  type CurveType,
} from 'recharts';
import {
  cartesianDecoration,
  Frame,
  animation,
  margin,
  useChartStyles,
} from './shared.js';
import type { CartesianProps, Series } from './shared.js';

import {
  markerProps,
  InteractiveTooltip,
  type MarkerOptions,
} from './interactions.js';

type LineSeries = Omit<Series, 'color'> & { color?: string; dash?: string };
export interface LineChartProps
  extends Omit<CartesianProps, 'series'>,
    MarkerOptions {
  valueLabels?: boolean;
  series: LineSeries[];
  strokeWidth?: number;
  curve?: CurveType;
  connectNulls?: boolean;
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
  connectNulls = false,
  tooltip,
  legendPosition,
  chartTheme,
  valueLabels = false,
  axes,
  animationKey,
  ...markers
}: LineChartProps) {
  const styles = useChartStyles(chartTheme);
  const decoration = cartesianDecoration(styles, axes);
  const matchPoints = useMemo(
    () => (animationKey ? matchByDataKey(animationKey) : undefined),
    [animationKey]
  );
  const lineMotion = animation(motion);
  return (
    <Frame title={title} height={height} chartTheme={chartTheme}>
      <Engine data={data} margin={margin} aria-label={title}>
        {grid && <CartesianGrid {...decoration.grid} />}
        <XAxis {...decoration.x} dataKey={categoryKey} />
        <YAxis {...decoration.y} width={42} />
        <InteractiveTooltip
          cursor={{ fill: 'none', strokeDasharray: '3 3' }}
          options={tooltip}
          motionEnabled={motion?.enabled !== false}
        />
        {legendPosition &&
          (legendPosition === 'left' || legendPosition === 'right' ? (
            <Legend position={legendPosition} />
          ) : (
            <Legend verticalAlign={legendPosition} />
          ))}
        {series.map((s) => (
          <Line
            key={s.key}
            dataKey={s.key}
            name={s.label}
            type={curve}
            stroke={s.color}
            label={valueLabels}
            strokeWidth={strokeWidth}
            strokeDasharray={s.dash}
            {...markerProps(markers, styles.surface, motion?.enabled !== false)}
            connectNulls={connectNulls}
            animationMatchBy={matchPoints}
            {...lineMotion}
          />
        ))}
      </Engine>
    </Frame>
  );
}
