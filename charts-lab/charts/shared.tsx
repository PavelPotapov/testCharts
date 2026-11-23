import type { ReactNode } from 'react';
import { ResponsiveContainer } from 'recharts';

export type Row = Record<string, string | number | null>;
export interface Series {
  key: string;
  label: string;
  color: string;
}
export interface Motion {
  enabled?: boolean;
  duration?: number;
  easing?: 'linear' | 'ease-in-out' | 'ease-out';
}
export interface FrameProps {
  height?: number;
  title: string;
  motion?: Motion;
}
export interface CartesianProps extends FrameProps {
  data: Row[];
  categoryKey: string;
  series: Series[];
  grid?: boolean;
}
export function Frame({
  title,
  height = 320,
  children,
}: FrameProps & { children: ReactNode }) {
  return (
    <div
      role="group"
      aria-label={title}
      style={{ width: '100%', height, minWidth: 0 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
export function animation(motion?: Motion) {
  return {
    isAnimationActive: motion?.enabled === false ? false : ('auto' as const),
    animationDuration: motion?.duration ?? 650,
    animationEasing: motion?.easing ?? ('ease-out' as const),
  };
}
export const axis = {
  axisLine: false,
  tickLine: false,
  tickMargin: 9,
  tick: { fill: 'var(--chart-axis, #667974)', fontSize: 12 },
};
export const gridColor = 'var(--chart-grid, #dce5e1)';
export const margin = { top: 18, right: 18, bottom: 6, left: 2 };
export const tooltipStyle = {
  borderRadius: 8,
  border: '1px solid #dce5e1',
  color: '#172d28',
  fontSize: 14,
};
