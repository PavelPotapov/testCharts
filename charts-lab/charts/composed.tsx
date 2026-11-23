import {
  Bar,
  CartesianGrid,
  ComposedChart as Engine,
  Line,
  XAxis,
  YAxis,
  type CurveType,
} from 'recharts';
import {
  cartesianDecoration,
  Frame,
  animation,
  margin,
  useChartStyles,
  type CartesianProps,
  type Series,
} from './shared.js';
import {
  InteractiveTooltip,
  markerProps,
  type MarkerOptions,
} from './interactions.js';
export interface ComposedChartProps
  extends Omit<CartesianProps, 'series'>,
    MarkerOptions {
  radius?: number;
  curve?: CurveType;
  valueLabels?: boolean;
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
  tooltip,
  legendPosition,
  chartTheme,
  radius = 4,
  curve = 'monotone',
  valueLabels = false,
  axes,
  barSize = 20,
  strokeWidth = 3,
  ...markers
}: ComposedChartProps) {
  const styles = useChartStyles(chartTheme);
  const decoration = cartesianDecoration(styles, axes);
  return (
    <Frame
      legendPosition={legendPosition}
      legendItems={series.map((s) => ({
        ...s,
        color: s.kind === 'line' ? s.strokeColor ?? s.color : s.color,
      }))}
      title={title}
      height={height}
      chartTheme={chartTheme}
    >
      <Engine data={data} margin={margin} aria-label={title}>
        {grid && <CartesianGrid {...decoration.grid} />}
        <XAxis {...decoration.x} dataKey={categoryKey} />
        <YAxis {...decoration.y} width={42} />
        {series.map((s) =>
          s.kind === 'bar' ? (
            <Bar
              key={s.key}
              name={s.label}
              dataKey={s.key}
              fill={s.color}
              radius={radius}
              label={valueLabels}
              barSize={barSize}
              {...animation(motion)}
            />
          ) : (
            <Line
              {...markerProps(
                markers,
                styles.surface,
                motion?.enabled !== false
              )}
              key={s.key}
              name={s.label}
              dataKey={s.key}
              type={curve}
              strokeDasharray={s.dash}
              label={valueLabels}
              stroke={s.strokeColor ?? s.color}
              strokeWidth={strokeWidth}
              {...animation(motion)}
            />
          )
        )}
        <InteractiveTooltip
          options={tooltip}
          motionEnabled={motion?.enabled !== false}
          cursor={{ fill: 'none', strokeDasharray: '3 3' }}
        />
      </Engine>
    </Frame>
  );
}
