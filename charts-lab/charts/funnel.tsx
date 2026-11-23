import { Funnel, FunnelChart as Engine, LabelList } from 'recharts';
import { Frame, animation, useChartStyles, type FrameProps } from './shared.js';
import { InteractiveTooltip } from './interactions.js';
export interface FunnelChartProps extends FrameProps {
  labelPosition?: 'right' | 'center' | 'left';
  fontSize?: number;
  borderWidth?: number;
  labelField?: 'name' | 'value';
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
  tooltip,
  legendPosition,
  chartTheme,
  labelPosition = 'right',
  fontSize = 12,
  borderWidth = 1,
  labelField = 'name',
  reversed = false,
  labels = true,
  lastShape = 'rectangle',
}: FunnelChartProps) {
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
        margin={{
          top: 10,
          bottom: 10,
          left: labels && labelPosition === 'left' ? 95 : 16,
          right: labels && labelPosition === 'right' ? 95 : 16,
        }}
        aria-label={title}
      >
        <Funnel
          data={data.map((row) => ({ ...row, fill: row.color }))}
          dataKey="value"
          nameKey="name"
          reversed={reversed}
          lastShapeType={lastShape}
          stroke={styles.surface}
          strokeWidth={borderWidth}
          {...animation(motion)}
        >
          {labels && (
            <LabelList
              dataKey={labelField}
              position={labelPosition}
              fill={styles.text}
              fontSize={fontSize}
            />
          )}
        </Funnel>
        <InteractiveTooltip
          options={tooltip}
          motionEnabled={motion?.enabled !== false}
          cursor={false}
          categoryKey="name"
        />
      </Engine>
    </Frame>
  );
}
