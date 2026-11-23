import {
  Radar,
  RadarChart as Engine,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Tooltip,
} from 'recharts';
import { ChartTooltip } from './tooltip.js';
import { Frame, animation, useChartStyles } from './shared.js';
import type { CartesianProps } from './shared.js';
export interface RadarChartProps extends CartesianProps {
  opacity?: number;
  strokeWidth?: number;
  gridType?: 'circle' | 'polygon';
}
export function RadarChart({
  data,
  categoryKey,
  series,
  title,
  height,
  motion,
  chartTheme,
  grid = true,
  opacity = 0.2,
  strokeWidth = 2,
  gridType = 'polygon',
}: RadarChartProps) {
  const styles = useChartStyles(chartTheme);
  return (
    <Frame title={title} height={height} chartTheme={chartTheme}>
      <Engine data={data} outerRadius="78%">
        {grid && <PolarGrid gridType={gridType} stroke={styles.gridStroke} />}
        <PolarAngleAxis dataKey={categoryKey} tick={styles.axis.tick} />
        <PolarRadiusAxis axisLine={false} tick={false} />
        {series.map((s) => (
          <Radar
            key={s.key}
            name={s.label}
            dataKey={s.key}
            stroke={s.strokeColor ?? s.color}
            fill={s.color}
            fillOpacity={opacity}
            strokeWidth={strokeWidth}
            {...animation(motion)}
          />
        ))}
        <Tooltip
          cursor={{ fill: 'none' }}
          content={(props) => <ChartTooltip {...props} />}
        />
      </Engine>
    </Frame>
  );
}
