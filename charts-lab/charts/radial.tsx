import { RadialBarChart as Engine, RadialBar, PolarAngleAxis } from 'recharts';
import { Frame, animation, useChartStyles, type FrameProps } from './shared.js';
import { InteractiveTooltip } from './interactions.js';
export interface RadialChartProps extends FrameProps {
  cornerRadius?: number;
  startAngle?: number;
  innerRadius?: number;
  outerRadius?: number;
  valueLabels?: boolean;
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
  tooltip,
  legendPosition,
  chartTheme,
  cornerRadius = 5,
  startAngle = 90,
  innerRadius = 21,
  outerRadius = 92,
  valueLabels = false,
  sweep = 300,
  thickness = 15,
  track = true,
}: RadialChartProps) {
  const styles = useChartStyles(chartTheme);
  return (
    <Frame
      legendPosition={legendPosition}
      legendItems={data.map((row) => ({ label: row.name, color: row.color }))}
      title={title}
      height={height}
      chartTheme={chartTheme}
    >
      <Engine
        data={data.map((row) => ({ ...row, fill: row.color }))}
        innerRadius={`${innerRadius}%`}
        outerRadius={`${outerRadius}%`}
        startAngle={startAngle}
        endAngle={startAngle - sweep}
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
          cornerRadius={cornerRadius}
          label={
            valueLabels ? { position: 'insideEnd', fill: styles.text } : false
          }
          background={track ? { fill: styles.bandFill } : false}
          {...animation(motion)}
        />
        <InteractiveTooltip
          options={tooltip}
          motionEnabled={motion?.enabled !== false}
          cursor={false}
          shared={false}
          categoryKey="name"
          defaultUnit="%"
        />
      </Engine>
    </Frame>
  );
}
