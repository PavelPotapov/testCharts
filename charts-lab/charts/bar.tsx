import {
  Bar,
  BarChart as Engine,
  BarStack,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Frame, animation, margin, useChartStyles } from './shared.js';
import type { CartesianProps } from './shared.js';

export interface BarChartProps extends CartesianProps {
  barSize?: number;
  radius?: number;
  horizontal?: boolean;
  stacked?: boolean;
}
export function BarChart({
  data,
  categoryKey,
  series,
  title,
  height,
  motion,
  chartTheme,
  grid = true,
  barSize = 16,
  radius = 4,
  horizontal = false,
  stacked = false,
}: BarChartProps) {
  const styles = useChartStyles(chartTheme);
  const hasNegativeValues = data.some((row) =>
    series.some(({ key }) => {
      const value = row[key];
      return typeof value === 'number' && value < 0;
    })
  );
  const bars = series.map((s) => (
    <Bar
      key={s.key}
      dataKey={s.key}
      name={s.label}
      fill={s.color}
      stroke={s.strokeColor}
      barSize={barSize}
      radius={stacked ? undefined : radius}
      {...animation(motion)}
    />
  ));
  return (
    <Frame title={title} height={height} chartTheme={chartTheme}>
      <Engine
        data={data}
        margin={margin}
        layout={horizontal ? 'vertical' : 'horizontal'}
        stackOffset="sign"
      >
        {grid && (
          <CartesianGrid
            stroke={styles.gridStroke}
            strokeDasharray="3 5"
            vertical={horizontal}
            horizontal={!horizontal}
          />
        )}
        <XAxis
          {...styles.axis}
          type={horizontal ? 'number' : 'category'}
          dataKey={horizontal ? undefined : categoryKey}
        />
        <YAxis
          {...styles.axis}
          width={44}
          type={horizontal ? 'category' : 'number'}
          dataKey={horizontal ? categoryKey : undefined}
        />
        {hasNegativeValues && (
          <ReferenceLine
            x={horizontal ? 0 : undefined}
            y={horizontal ? undefined : 0}
            stroke={styles.referenceStroke}
          />
        )}
        <Tooltip {...styles.tooltip} />
        {stacked ? <BarStack radius={radius}>{bars}</BarStack> : bars}
      </Engine>
    </Frame>
  );
}
