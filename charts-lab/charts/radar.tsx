import {
  Radar,
  RadarChart as Engine,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
} from 'recharts';
import {
  InteractiveTooltip,
  markerProps,
  type MarkerOptions,
} from './interactions.js';
import { Frame, animation, useChartStyles } from './shared.js';
import type { CartesianProps } from './shared.js';
export interface RadarChartProps extends CartesianProps, MarkerOptions {
  outerRadius?: number;
  startAngle?: number;
  spokes?: boolean;
  scaleMax?: number;
  valueLabels?: boolean;
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
  tooltip,
  legendPosition,
  chartTheme,
  outerRadius = 78,
  startAngle = 90,
  spokes = true,
  scaleMax,
  valueLabels = false,
  grid = true,
  opacity = 0.2,
  strokeWidth = 2,
  gridType = 'polygon',
  ...markers
}: RadarChartProps) {
  const styles = useChartStyles(chartTheme);
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
        outerRadius={`${outerRadius}%`}
        startAngle={startAngle}
        endAngle={startAngle - 360}
      >
        {grid && (
          <PolarGrid
            gridType={gridType}
            radialLines={spokes}
            stroke={styles.gridStroke}
          />
        )}
        <PolarAngleAxis dataKey={categoryKey} tick={styles.axis.tick} />
        <PolarRadiusAxis
          domain={scaleMax ? [0, scaleMax] : undefined}
          axisLine={false}
          tick={false}
        />
        {series.map((s) => (
          <Radar
            {...markerProps(markers, styles.surface, motion?.enabled !== false)}
            key={s.key}
            name={s.label}
            dataKey={s.key}
            stroke={s.strokeColor ?? s.color}
            fill={s.color}
            fillOpacity={opacity}
            strokeDasharray={s.dash}
            label={valueLabels}
            strokeWidth={strokeWidth}
            {...animation(motion)}
          />
        ))}
        <InteractiveTooltip
          options={tooltip}
          motionEnabled={motion?.enabled !== false}
          cursor={{ fill: 'none', strokeDasharray: '3 3' }}
        />
      </Engine>
    </Frame>
  );
}
