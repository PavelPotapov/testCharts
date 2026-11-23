import {
  Radar,
  RadarChart as Engine,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Tooltip,
} from 'recharts';
import { Frame, animation, axis, gridColor, tooltipStyle } from './shared.js';
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
  grid = true,
  opacity = 0.2,
  strokeWidth = 2,
  gridType = 'polygon',
}: RadarChartProps) {
  return (
    <Frame title={title} height={height}>
      <Engine data={data} outerRadius="78%">
        {grid && <PolarGrid gridType={gridType} stroke={gridColor} />}
        <PolarAngleAxis dataKey={categoryKey} tick={axis.tick} />
        <PolarRadiusAxis axisLine={false} tick={false} />
        {series.map((s) => (
          <Radar
            key={s.key}
            name={s.label}
            dataKey={s.key}
            stroke={s.color}
            fill={s.color}
            fillOpacity={opacity}
            strokeWidth={strokeWidth}
            {...animation(motion)}
          />
        ))}
        <Tooltip contentStyle={tooltipStyle} />
      </Engine>
    </Frame>
  );
}
