import {
  RadialBarChart as Engine,
  RadialBar,
  PolarAngleAxis,
  Tooltip,
} from 'recharts';
import { Frame, animation, useChartStyles, type FrameProps } from './shared.js';
import { ChartTooltip } from './tooltip.js';
export interface RadialChartProps extends FrameProps {
  data: { name: string; value: number; color: string }[];
  sweep?: number;
  thickness?: number;
  track?: boolean;
}
export function RadialChart({
  data,
  title,
  height,
  motion,
  chartTheme,
  sweep = 300,
  thickness = 15,
  track = true,
}: RadialChartProps) {
  const styles = useChartStyles(chartTheme);
  return (
    <Frame title={title} height={height} chartTheme={chartTheme}>
      <Engine
        data={data.map((row) => ({ ...row, fill: row.color }))}
        innerRadius="21%"
        outerRadius="92%"
        startAngle={90}
        endAngle={90 - sweep}
        barSize={thickness}
        aria-label={title}
      >
        <PolarAngleAxis
          type="number"
          domain={[0, 100]}
          tick={false}
          axisLine={false}
        />
        <RadialBar
          dataKey="value"
          cornerRadius={5}
          background={track ? { fill: styles.bandFill } : false}
          {...animation(motion)}
        />
        <Tooltip
          shared={false}
          cursor={false}
          content={(props) => (
            <ChartTooltip
              {...props}
              categoryKey="name"
              options={{ unit: '%' }}
            />
          )}
        />
      </Engine>
    </Frame>
  );
}
