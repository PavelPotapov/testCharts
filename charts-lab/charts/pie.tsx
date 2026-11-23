import { Pie, PieChart as Engine, Tooltip } from 'recharts';
import { Frame, animation, tooltipStyle } from './shared.js';
import type { FrameProps } from './shared.js';
export interface Slice {
  name: string;
  value: number;
  color: string;
}
export interface PieChartProps extends FrameProps {
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
  hole = 54,
  gap = 3,
  startAngle = 90,
}: PieChartProps) {
  const slices = data
    .filter((slice) => slice.value > 0)
    .map((slice) => ({ ...slice, fill: slice.color }));
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
    <Frame title={title} height={height}>
      <Engine>
        <Pie
          data={slices}
          nameKey="name"
          dataKey="value"
          outerRadius="85%"
          innerRadius={`${hole}%`}
          startAngle={startAngle}
          endAngle={startAngle - 360}
          paddingAngle={gap}
          stroke="none"
          {...animation(motion)}
        />
        <Tooltip contentStyle={tooltipStyle} />
      </Engine>
    </Frame>
  );
}
