import type { CSSProperties } from 'react';
import { Symbols, Tooltip, usePlotArea, type ActiveDotProps } from 'recharts';
import { ChartTooltip, type TooltipOptions } from './tooltip.js';

export type MarkerShape = 'circle' | 'diamond' | 'square' | 'triangle';
export type MarkerAppearance = 'none' | 'grow' | 'fade' | 'pulse';
export interface LineTooltipOptions extends Partial<TooltipOptions> {
  position?:
    | 'follow'
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right';
  appearance?: 'none' | 'fade' | 'rise';
  duration?: number;
  smoothTracking?: boolean;
}

// Keep motion with the line entry point so consumers do not need the laboratory stylesheet.
export const hoverStyles = `
  @keyframes chart-lab-line-fade { from { opacity: 0 } }
  @keyframes chart-lab-line-grow { from { transform: scale(.3); opacity: .35 } }
  @keyframes chart-lab-line-pulse { 0% { transform: scale(.65) } 55% { transform: scale(1.55) } }
  @keyframes chart-lab-line-rise { from { transform: translateY(8px); opacity: 0 } }
  @media (prefers-reduced-motion: no-preference) {
    .chart-lab-line-enter {
      animation-timing-function: ease-out;
      transform-box: fill-box;
      transform-origin: center;
    }
    .chart-lab-line-enter[data-appearance="fade"] { animation-name: chart-lab-line-fade }
    .chart-lab-line-enter[data-appearance="grow"] { animation-name: chart-lab-line-grow }
    .chart-lab-line-enter[data-appearance="pulse"] { animation-name: chart-lab-line-pulse }
    .chart-lab-line-enter[data-appearance="rise"] { animation-name: chart-lab-line-rise }
  }
`;

export function ActiveMarker({
  point,
  radius,
  shape,
  appearance,
  duration,
  outline,
}: {
  point: ActiveDotProps;
  radius: number;
  shape: MarkerShape;
  appearance: MarkerAppearance;
  duration: number;
  outline?: string;
}) {
  return (
    <g
      className="chart-lab-line-enter"
      data-appearance={appearance}
      style={{ animationDuration: duration + 'ms' }}
      pointerEvents="none"
    >
      <Symbols
        type={shape}
        cx={point.cx}
        cy={point.cy}
        size={radius * 2}
        sizeType="diameter"
        fill={point.fill}
        stroke={outline}
        strokeWidth={2}
        strokeDasharray="none"
      />
    </g>
  );
}

export function LineTooltip({
  options,
  motionEnabled,
}: {
  options?: LineTooltipOptions;
  motionEnabled: boolean;
}) {
  const plot = usePlotArea();
  const position = options?.position ?? 'follow';
  let pinned: CSSProperties | undefined;
  if (position !== 'follow' && plot) {
    const right = position.endsWith('right');
    const bottom = position.startsWith('bottom');
    const inset = 6;
    pinned = {
      left: plot.x + (right ? plot.width - inset : inset),
      top: plot.y + (bottom ? plot.height - inset : inset),
      transform: `translate(${right ? '-100%' : '0'}, ${
        bottom ? '-100%' : '0'
      })`,
      maxWidth: Math.max(0, plot.width - 2 * inset),
      width: 'max-content',
    };
  }
  const appearance = motionEnabled ? options?.appearance ?? 'none' : 'none';
  return (
    <Tooltip
      cursor={{ fill: 'none', strokeDasharray: '3 3' }}
      wrapperStyle={pinned}
      isAnimationActive={
        motionEnabled &&
        position === 'follow' &&
        options?.smoothTracking !== false
          ? 'auto'
          : false
      }
      animationDuration={options?.duration}
      content={(props) =>
        props.active && props.payload.length > 0 ? (
          <div
            className="chart-lab-line-enter"
            data-appearance={appearance}
            style={{ animationDuration: (options?.duration ?? 240) + 'ms' }}
          >
            <ChartTooltip
              {...props}
              options={{ unit: options?.unit ?? '', compare: options?.compare }}
            />
          </div>
        ) : null
      }
    />
  );
}
