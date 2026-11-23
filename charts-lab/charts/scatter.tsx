import {
  Scatter,
  ScatterChart as Engine,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
} from 'recharts';
import { InteractiveTooltip } from './interactions.js';
import {
  cartesianDecoration,
  Frame,
  animation,
  margin,
  useChartStyles,
} from './shared.js';
import type { FrameProps, AxesOptions } from './shared.js';
export interface Point {
  x: number;
  y: number;
  z: number;
}
export interface ScatterChartProps extends FrameProps {
  connection?: 'none' | 'joint' | 'fitting';
  opacity?: number;
  minArea?: number;
  valueLabels?: boolean;
  data: Point[];
  axes?: AxesOptions;
  color: string;
  grid?: boolean;
  maxArea?: number;
  shape?: 'circle' | 'diamond' | 'square' | 'triangle' | 'star' | 'cross';
}
export function ScatterChart({
  data,
  title,
  height,
  motion,
  tooltip,
  legendPosition,
  chartTheme,
  connection = 'none',
  opacity = 0.8,
  minArea = 25,
  valueLabels = false,
  axes,
  grid = true,
  color,
  maxArea = 320,
  shape = 'circle',
}: ScatterChartProps) {
  const styles = useChartStyles(chartTheme);
  const decoration = cartesianDecoration(styles, axes, true, true);
  return (
    <Frame
      legendPosition={legendPosition}
      legendItems={[{ label: 'Точки', color }]}
      title={title}
      height={height}
      chartTheme={chartTheme}
    >
      <Engine margin={margin}>
        {grid && <CartesianGrid {...decoration.grid} />}
        <XAxis {...decoration.x} dataKey="x" type="number" name="X" />
        <YAxis
          {...decoration.y}
          width={42}
          dataKey="y"
          type="number"
          name="Y"
        />
        <ZAxis dataKey="z" type="number" name="Z" range={[minArea, maxArea]} />
        <Scatter
          data={data}
          fill={color}
          stroke={color}
          fillOpacity={opacity}
          line={connection !== 'none'}
          lineType={connection === 'fitting' ? 'fitting' : 'joint'}
          label={valueLabels ? { dataKey: 'z', position: 'top' } : false}
          shape={shape}
          {...animation(motion)}
        />
        <InteractiveTooltip
          options={tooltip}
          motionEnabled={motion?.enabled !== false}
          fallbackColor={color}
        />
      </Engine>
    </Frame>
  );
}
