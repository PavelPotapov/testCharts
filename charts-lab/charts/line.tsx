import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as Engine,
  XAxis,
  YAxis,
  matchByDataKey,
} from 'recharts';
import { Frame, animation, margin, useChartStyles } from './shared.js';
import type { CartesianProps, Series } from './shared.js';

import {
  ActiveMarker,
  LineTooltip,
  hoverStyles,
  type LineTooltipOptions,
  type MarkerShape,
  type MarkerAppearance,
} from './lineHover.js';

type LineSeries = Omit<Series, 'color'> & { color?: string; dash?: string };
export interface LineChartProps extends Omit<CartesianProps, 'series'> {
  series: LineSeries[];
  strokeWidth?: number;
  curve?: 'linear' | 'monotone' | 'step';
  dots?: boolean;
  dotShape?: MarkerShape;
  activeDotAppearance?: MarkerAppearance;
  activeDotDuration?: number;
  dotRadius?: number;
  activeRadius?: number;
  hollowDots?: boolean;
  connectNulls?: boolean;
  tooltip?: LineTooltipOptions;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
  animationKey?: string;
}

export function LineChart({
  data,
  categoryKey,
  series,
  title,
  height,
  motion,
  grid = true,
  strokeWidth = 3,
  curve = 'monotone',
  dots = false,
  dotShape = 'circle',
  activeDotAppearance = 'none',
  activeDotDuration = 240,
  dotRadius = 3,
  activeRadius = 5,
  hollowDots = false,
  connectNulls = false,
  tooltip,
  legendPosition,
  chartTheme,
  animationKey,
}: LineChartProps) {
  const styles = useChartStyles(chartTheme);
  const matchPoints = useMemo(
    () => (animationKey ? matchByDataKey(animationKey) : undefined),
    [animationKey]
  );
  const lineMotion = animation(motion);
  return (
    <Frame title={title} height={height} chartTheme={chartTheme}>
      <Engine data={data} margin={margin} aria-label={title}>
        {grid && (
          <CartesianGrid
            stroke={styles.gridStroke}
            strokeDasharray="3 5"
            vertical={false}
          />
        )}
        <XAxis {...styles.axis} dataKey={categoryKey} />
        <YAxis {...styles.axis} width={42} />
        <defs>
          <style>{hoverStyles}</style>
        </defs>
        <LineTooltip
          options={tooltip}
          motionEnabled={motion?.enabled !== false}
        />
        {legendPosition &&
          (legendPosition === 'left' || legendPosition === 'right' ? (
            <Legend position={legendPosition} />
          ) : (
            <Legend verticalAlign={legendPosition} />
          ))}
        {series.map((s) => (
          <Line
            key={s.key}
            dataKey={s.key}
            name={s.label}
            type={curve}
            stroke={s.color}
            strokeWidth={strokeWidth}
            strokeDasharray={s.dash}
            dot={
              dots
                ? {
                    symbol: dotShape === 'circle' ? undefined : dotShape,
                    r: dotRadius,
                    strokeWidth: hollowDots ? 2 : 0,
                    strokeDasharray: 'none',
                    ...(hollowDots ? { fill: styles.surface } : {}),
                  }
                : false
            }
            activeDot={
              activeRadius <= 0
                ? false
                : motion?.enabled !== false && activeDotAppearance !== 'none'
                ? (point) => (
                    <ActiveMarker
                      key={point.index}
                      point={point}
                      shape={dotShape}
                      radius={activeRadius}
                      outline={styles.surface}
                      appearance={activeDotAppearance}
                      duration={activeDotDuration}
                    />
                  )
                : {
                    symbol: dotShape === 'circle' ? undefined : dotShape,
                    r: activeRadius,
                    stroke: styles.surface,
                    strokeWidth: 2,
                    strokeDasharray: 'none',
                  }
            }
            connectNulls={connectNulls}
            animationMatchBy={matchPoints}
            {...lineMotion}
          />
        ))}
      </Engine>
    </Frame>
  );
}
