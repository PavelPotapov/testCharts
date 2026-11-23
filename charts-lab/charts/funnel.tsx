import { Funnel, FunnelChart as Engine, LabelList, Tooltip } from 'recharts';
import { Frame, animation, useChartStyles, type FrameProps } from './shared.js';
import { ChartTooltip } from './tooltip.js';
export interface FunnelChartProps extends FrameProps {
  data: { name: string; value: number; color: string }[];
  reversed?: boolean;
  labels?: boolean;
  lastShape?: 'triangle' | 'rectangle';
}
export function FunnelChart({
  data,
  title,
  height,
  motion,
  chartTheme,
  reversed = false,
  labels = true,
  lastShape = 'rectangle',
}: FunnelChartProps) {
  const styles = useChartStyles(chartTheme);
  return (
    <Frame title={title} height={height} chartTheme={chartTheme}>
      <Engine
        margin={{ top: 10, bottom: 10, left: 16, right: labels ? 95 : 16 }}
        aria-label={title}
      >
        <Funnel
          data={data.map((row) => ({ ...row, fill: row.color }))}
          dataKey="value"
          nameKey="name"
          reversed={reversed}
          lastShapeType={lastShape}
          stroke={styles.surface}
          {...animation(motion)}
        >
          {labels && (
            <LabelList
              dataKey="name"
              position="right"
              fill={styles.text}
              fontSize={12}
            />
          )}
        </Funnel>
        <Tooltip
          cursor={false}
          content={(props) => <ChartTooltip {...props} categoryKey="name" />}
        />
      </Engine>
    </Frame>
  );
}
