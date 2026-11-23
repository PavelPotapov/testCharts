import {
  Bar,
  CartesianGrid,
  ComposedChart as Engine,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Frame,
  animation,
  margin,
  useChartStyles,
  type CartesianProps,
  type Series,
} from './shared.js';
import { ChartTooltip } from './tooltip.js';
export interface ComposedChartProps extends Omit<CartesianProps, 'series'> {
  series: (Series & { kind: 'bar' | 'line' })[];
  barSize?: number;
  strokeWidth?: number;
}
export function ComposedChart({
  data,
  categoryKey,
  series,
  grid = true,
  title,
  height,
  motion,
  chartTheme,
  barSize = 20,
  strokeWidth = 3,
}: ComposedChartProps) {
  const styles = useChartStyles(chartTheme);
  return (
    <Frame title={title} height={height} chartTheme={chartTheme}>
      <Engine data={data} margin={margin} aria-label={title}>
        {grid && (
          <CartesianGrid
            stroke={styles.gridStroke}
            vertical={false}
            strokeDasharray="3 5"
          />
        )}
        <XAxis {...styles.axis} dataKey={categoryKey} />
        <YAxis {...styles.axis} width={42} />
        {series.map((s) =>
          s.kind === 'bar' ? (
            <Bar
              key={s.key}
              name={s.label}
              dataKey={s.key}
              fill={s.color}
              radius={4}
              barSize={barSize}
              {...animation(motion)}
            />
          ) : (
            <Line
              key={s.key}
              name={s.label}
              dataKey={s.key}
              type="monotone"
              stroke={s.strokeColor ?? s.color}
              strokeWidth={strokeWidth}
              dot={false}
              {...animation(motion)}
            />
          )
        )}
        <Tooltip
          cursor={{ fill: 'none' }}
          content={(props) => <ChartTooltip {...props} />}
        />
      </Engine>
    </Frame>
  );
}
