import { Treemap, Tooltip } from 'recharts';
import { Frame, animation, useChartStyles } from './shared.js';
import type { FrameProps } from './shared.js';
export type TreeItem = {
  name: string;
  size?: number;
  color?: string;
  children?: TreeItem[];
};
export interface TreemapChartProps extends FrameProps {
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
  chartTheme,
  color,
  ratio = 1.6,
  strokeWidth = 3,
}: TreemapChartProps) {
  const styles = useChartStyles(chartTheme);
  return (
    <Frame title={title} height={height} chartTheme={chartTheme}>
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
                fill={typeof tileColor === 'string' ? tileColor : color}
                stroke={styles.surface}
                strokeWidth={strokeWidth}
              />
              {width > 95 && tileHeight > 52 && (
                <text
                  x={x + 12}
                  y={y + 25}
                  fill={styles.text ?? 'white'}
                  fontSize={14}
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
        <Tooltip {...styles.tooltip} />
      </Treemap>
    </Frame>
  );
}
