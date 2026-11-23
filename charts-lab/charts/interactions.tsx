import type { CSSProperties } from 'react';
import {
  Symbols,
  Tooltip,
  usePlotArea,
  type ActiveDotProps,
  type TooltipProps,
} from 'recharts';
import { ChartTooltip, type TooltipOptions } from './tooltip.js';

export type MarkerShape = 'circle' | 'diamond' | 'square' | 'triangle';
export type MarkerAppearance = 'none' | 'grow' | 'fade' | 'pulse';
export interface InteractiveTooltipOptions extends Partial<TooltipOptions> {
  enabled?: boolean;
  trigger?: 'hover' | 'click';
  offset?: number;
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

export function InteractiveTooltip({
  options,
  motionEnabled,
  cursor = { fill: 'none' },
  shared,
  categoryKey,
  fallbackColor,
  defaultUnit = '',
}: {
  options?: InteractiveTooltipOptions;
  motionEnabled: boolean;
  cursor?: TooltipProps['cursor'];
  shared?: boolean;
  categoryKey?: string;
  fallbackColor?: string;
  defaultUnit?: string;
}) {
  const plot = usePlotArea();
  const position = options?.position ?? 'follow';
  let pinned: CSSProperties | undefined;
  if (position !== 'follow') {
    const right = position.endsWith('right');
    const bottom = position.startsWith('bottom');
    const inset = 6;
    pinned = {
      left: plot
        ? plot.x + (right ? plot.width - inset : inset)
        : right
        ? 'calc(100% - 6px)'
        : inset,
      top: plot
        ? plot.y + (bottom ? plot.height - inset : inset)
        : bottom
        ? 'calc(100% - 6px)'
        : inset,
      transform: `translate(${right ? '-100%' : '0'}, ${
        bottom ? '-100%' : '0'
      })`,
      maxWidth: plot
        ? Math.max(0, plot.width - 2 * inset)
        : 'calc(100% - 12px)',
      width: 'max-content',
    };
  }
  const appearance = motionEnabled ? options?.appearance ?? 'none' : 'none';
  if (options?.enabled === false) return null;
  return (
    <Tooltip
      cursor={cursor}
      shared={shared}
      trigger={options?.trigger}
      offset={options?.offset}
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
              categoryKey={categoryKey}
              fallbackColor={fallbackColor}
              options={{
                unit: options?.unit ?? defaultUnit,
                compare: options?.compare,
              }}
            />
          </div>
        ) : null
      }
    />
  );
}

export interface MarkerOptions {
  dots?: boolean;
  dotShape?: MarkerShape;
  activeDotAppearance?: MarkerAppearance;
  activeDotDuration?: number;
  dotRadius?: number;
  activeRadius?: number;
  hollowDots?: boolean;
}
export function markerProps(
  {
    dots = false,
    dotShape = 'circle',
    activeDotAppearance = 'none',
    activeDotDuration = 240,
    dotRadius = 3,
    activeRadius = 5,
    hollowDots = false,
  }: MarkerOptions,
  surface: string | undefined,
  animate: boolean
) {
  const dot = dots
    ? {
        symbol: dotShape === 'circle' ? undefined : dotShape,
        r: dotRadius,
        strokeWidth: hollowDots ? 2 : 0,
        strokeDasharray: 'none',
        ...(hollowDots ? { fill: surface } : {}),
      }
    : false;
  const activeDot =
    activeRadius <= 0
      ? false
      : animate && activeDotAppearance !== 'none'
      ? (point: ActiveDotProps) => (
          <ActiveMarker
            key={point.index}
            point={point}
            shape={dotShape}
            radius={activeRadius}
            outline={surface}
            appearance={activeDotAppearance}
            duration={activeDotDuration}
          />
        )
      : {
          symbol: dotShape === 'circle' ? undefined : dotShape,
          r: activeRadius,
          stroke: surface,
          strokeWidth: 2,
          strokeDasharray: 'none',
        };
  return { dot, activeDot };
}
