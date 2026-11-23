import {
  Scatter,
  ScatterChart as Engine,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChartTooltip } from './tooltip.js';
import { Frame, animation, margin, useChartStyles } from './shared.js';
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
  chartTheme,
  grid = true,
  color,
  maxArea = 320,
  shape = 'circle',
}: ScatterChartProps) {
  const styles = useChartStyles(chartTheme);
  return (
    <Frame title={title} height={height} chartTheme={chartTheme}>
      <Engine margin={margin}>
        {grid && (
          <CartesianGrid stroke={styles.gridStroke} strokeDasharray="3 5" />
        )}
        <XAxis {...styles.axis} dataKey="x" type="number" name="X" />
        <YAxis {...styles.axis} width={42} dataKey="y" type="number" name="Y" />
        <ZAxis dataKey="z" type="number" name="Z" range={[25, maxArea]} />
        <Scatter
          data={data}
          fill={color}
          stroke={color}
          fillOpacity={0.8}
          shape={shape}
          {...animation(motion)}
        />
        <Tooltip
          cursor={{ fill: 'none' }}
          content={(props) => <ChartTooltip {...props} fallbackColor={color} />}
        />
      </Engine>
    </Frame>
  );
}
