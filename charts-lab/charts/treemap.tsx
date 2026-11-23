import { Treemap, Tooltip } from 'recharts';
import { Frame, animation, tooltipStyle } from './shared.js';
import type { FrameProps } from './shared.js';
export type TreeItem = { name: string; size?: number; children?: TreeItem[] };
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
  color,
  ratio = 1.6,
  strokeWidth = 3,
}: TreemapChartProps) {
  return (
    <Frame title={title} height={height}>
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
                fill={color}
                stroke="white"
                strokeWidth={strokeWidth}
              />
              {width > 95 && tileHeight > 52 && (
                <text x={x + 12} y={y + 25} fill="white" fontSize={14}>
                  {String(name)} · {value}
                </text>
              )}
            </g>
          )
        }
        {...animation(motion)}
      >
        <Tooltip contentStyle={tooltipStyle} />
      </Treemap>
    </Frame>
  );
}
