import { Treemap } from 'recharts';
import { InteractiveTooltip } from './interactions.js';
import { Frame, animation, useChartStyles } from './shared.js';
import type { FrameProps } from './shared.js';
export type TreeItem = {
  name: string;
  size?: number;
  color?: string;
  children?: TreeItem[];
};
export interface TreemapChartProps extends FrameProps {
  radius?: number;
  labels?: boolean;
  fontSize?: number;
  labelMinWidth?: number;
  data: TreeItem[];
  color: string;
  ratio?: number;
  strokeWidth?: number;
}
export function TreemapChart({
  data,
  title,
  height,
  motion,
  tooltip,
  legendPosition,
  chartTheme,
  radius = 0,
  labels = true,
  fontSize = 14,
  labelMinWidth = 95,
  color,
  ratio = 1.6,
  strokeWidth = 3,
}: TreemapChartProps) {
  const styles = useChartStyles(chartTheme);
  return (
    <Frame
      legendPosition={legendPosition}
      legendItems={data.map((row) => ({
        label: row.name,
        color: row.color ?? color,
      }))}
      title={title}
      height={height}
      chartTheme={chartTheme}
    >
      <Treemap
        data={data}
        dataKey="size"
        nameKey="name"
        aspectRatio={ratio}
        content={({
          x,
          y,
          width,
          height: tileHeight,
          name,
          value,
          depth,
          children,
          color: tileColor,
        }) =>
          depth === 0 || children?.length ? (
            <g />
          ) : (
            <g>
              <rect
                x={x}
                y={y}
                width={width}
                height={tileHeight}
                className="treemap-cell"
                rx={radius}
                fill={typeof tileColor === 'string' ? tileColor : color}
                stroke={styles.surface}
                strokeWidth={strokeWidth}
              />
              {labels &&
                width > labelMinWidth &&
                tileHeight > fontSize * 2.5 && (
                  <text
                    x={x + 12}
                    y={y + 25}
                    fill={styles.text ?? 'white'}
                    fontSize={fontSize}
                    stroke={styles.text ? styles.surface : undefined}
                    strokeWidth={4}
                    strokeLinejoin="round"
                    paintOrder="stroke"
                  >
                    {String(name)} · {value}
                  </text>
                )}
            </g>
          )
        }
        {...animation(motion)}
      >
        <InteractiveTooltip
          options={tooltip}
          motionEnabled={motion?.enabled !== false}
          categoryKey="name"
          fallbackColor={color}
        />
      </Treemap>
    </Frame>
  );
}
