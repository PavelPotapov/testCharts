import {
  Scatter,
  ScatterChart as Engine,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  Frame,
  animation,
  axis,
  gridColor,
  margin,
  tooltipStyle,
} from './shared.js';
import type { FrameProps } from './shared.js';
export interface Point {
  x: number;
  y: number;
  z: number;
}
export interface ScatterChartProps extends FrameProps {
  data: Point[];
  color: string;
  grid?: boolean;
  maxArea?: number;
  shape?: 'circle' | 'diamond' | 'square';
}
export function ScatterChart({
  data,
  title,
  height,
  motion,
  grid = true,
  color,
  maxArea = 320,
  shape = 'circle',
}: ScatterChartProps) {
  return (
    <Frame title={title} height={height}>
      <Engine margin={margin}>
        {grid && <CartesianGrid stroke={gridColor} strokeDasharray="3 5" />}
        <XAxis {...axis} dataKey="x" type="number" name="X" />
        <YAxis {...axis} width={42} dataKey="y" type="number" name="Y" />
        <ZAxis dataKey="z" type="number" name="Z" range={[25, maxArea]} />
        <Scatter
          data={data}
          fill={color}
          fillOpacity={0.8}
          shape={shape}
          {...animation(motion)}
        />
        <Tooltip contentStyle={tooltipStyle} />
      </Engine>
    </Frame>
  );
}
