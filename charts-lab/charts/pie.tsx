import { Pie, PieChart as Engine } from 'recharts';
import { InteractiveTooltip } from './interactions.js';
import { Frame, animation } from './shared.js';
import type { FrameProps } from './shared.js';
export interface Slice {
  name: string;
  value: number;
  color: string;
  strokeColor?: string;
}
export interface PieChartProps extends FrameProps {
  cornerRadius?: number;
  outerRadius?: number;
  sweep?: number;
  minAngle?: number;
  labels?: boolean;
  labelLine?: boolean;
  centerX?: number;
  centerY?: number;
  clockwise?: boolean;
  borderWidth?: number;
  data: Slice[];
  hole?: number;
  gap?: number;
  startAngle?: number;
}
export function PieChart({
  data,
  title,
  height,
  motion,
  tooltip,
  legendPosition,
  chartTheme,
  cornerRadius = 0,
  outerRadius = 85,
  sweep = 360,
  minAngle = 0,
  labels = false,
  labelLine = true,
  centerX = 50,
  centerY = 50,
  clockwise = true,
  borderWidth = 1,
  hole = 54,
  gap = 3,
  startAngle = 90,
}: PieChartProps) {
  const slices = data
    .filter((slice) => slice.value > 0)
    .map((slice) => ({
      ...slice,
      fill: slice.color,
      stroke: slice.strokeColor ?? 'none',
    }));
  if (!slices.length) {
    return (
      <div
        role="status"
        style={{ display: 'grid', placeItems: 'center', height: height ?? 320 }}
      >
        Нет данных для отображения
      </div>
    );
  }
  return (
    <Frame
      legendPosition={legendPosition}
      legendItems={slices.map((row) => ({ label: row.name, color: row.color }))}
      title={title}
      height={height}
      chartTheme={chartTheme}
    >
      <Engine>
        <Pie
          data={slices}
          nameKey="name"
          dataKey="value"
          outerRadius={`${outerRadius}%`}
          cx={`${centerX}%`}
          cy={`${centerY}%`}
          cornerRadius={cornerRadius}
          minAngle={minAngle}
          strokeWidth={borderWidth}
          label={labels}
          labelLine={labels && labelLine}
          innerRadius={`${hole}%`}
          startAngle={startAngle}
          endAngle={startAngle + (clockwise ? -sweep : sweep)}
          paddingAngle={gap}
          stroke="none"
          {...animation(motion)}
        />
        <InteractiveTooltip
          options={tooltip}
          motionEnabled={motion?.enabled !== false}
          categoryKey="name"
        />
      </Engine>
    </Frame>
  );
}
