import {
  Bar,
  BarChart as Engine,
  BarStack,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';
import { InteractiveTooltip } from './interactions.js';
import {
  cartesianDecoration,
  Frame,
  animation,
  margin,
  useChartStyles,
} from './shared.js';
import type { CartesianProps } from './shared.js';

export interface BarChartProps extends CartesianProps {
  barGap?: number;
  minPointSize?: number;
  track?: boolean;
  valueLabels?: boolean;
  tooltipShared?: boolean;
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
  tooltip,
  legendPosition,
  chartTheme,
  barGap,
  minPointSize,
  track = false,
  valueLabels = false,
  tooltipShared,
  axes,
  grid = true,
  barSize = 16,
  radius = 4,
  horizontal = false,
  stacked = false,
}: BarChartProps) {
  const styles = useChartStyles(chartTheme);
  const decoration = cartesianDecoration(styles, axes, horizontal, !horizontal);
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
      minPointSize={minPointSize}
      background={track ? { fill: styles.bandFill } : false}
      label={valueLabels}
      radius={stacked ? undefined : radius}
      {...animation(motion)}
    />
  ));
  return (
    <Frame
      legendPosition={legendPosition}
      legendItems={series}
      title={title}
      height={height}
      chartTheme={chartTheme}
    >
      <Engine
        data={data}
        margin={margin}
        layout={horizontal ? 'vertical' : 'horizontal'}
        barGap={barGap}
        stackOffset="sign"
      >
        {grid && <CartesianGrid {...decoration.grid} />}
        <XAxis
          {...decoration.x}
          type={horizontal ? 'number' : 'category'}
          dataKey={horizontal ? undefined : categoryKey}
        />
        <YAxis
          {...decoration.y}
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
        <InteractiveTooltip
          shared={tooltipShared}
          options={tooltip}
          motionEnabled={motion?.enabled !== false}
          cursor={{ fill: styles.bandFill, stroke: 'none' }}
        />
        {stacked ? <BarStack radius={radius}>{bars}</BarStack> : bars}
      </Engine>
    </Frame>
  );
}
