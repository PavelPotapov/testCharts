import { useMemo } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as Engine,
  RechartsThemeProvider,
  Tooltip,
  XAxis,
  YAxis,
  matchByDataKey,
  useRechartsTheme,
  type RechartsTheme,
  type TooltipContentProps,
} from 'recharts';
import {
  Frame,
  animation,
  axis,
  gridColor,
  margin,
  tooltipStyle,
} from './shared.js';
import type { CartesianProps, Series } from './shared.js';

type LineSeries = Omit<Series, 'color'> & { color?: string; dash?: string };
type TooltipOptions = {
  unit: string;
  compare?: [actualKey: string, planKey: string];
};

export interface LineChartProps extends Omit<CartesianProps, 'series'> {
  series: LineSeries[];
  strokeWidth?: number;
  curve?: 'linear' | 'monotone' | 'step';
  dots?: boolean;
  connectNulls?: boolean;
  tooltip?: TooltipOptions;
  legendPosition?: 'top' | 'bottom';
  chartTheme?: RechartsTheme;
  animationKey?: string;
}

const number = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 });
const signed = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
});

function ComparisonTooltip({
  active,
  accessibilityLayer,
  label,
  payload,
  options,
}: TooltipContentProps & { options: TooltipOptions }) {
  const theme = useRechartsTheme();
  if (!active || !payload.length || !options.compare) return null;

  const [actualKey, planKey] = options.compare;
  const actual = payload.find((item) => item.dataKey === actualKey);
  const plan = payload.find((item) => item.dataKey === planKey);
  const difference =
    typeof actual?.value === 'number' && typeof plan?.value === 'number'
      ? signed.format(actual.value - plan.value) + ' ' + options.unit
      : 'нет данных';

  return (
    <div
      role={accessibilityLayer ? 'status' : undefined}
      aria-atomic={accessibilityLayer || undefined}
      style={{
        background: '#fff',
        padding: '9px 11px',
        ...tooltipStyle,
        ...theme?.tooltip?.contentStyle,
      }}
    >
      <strong>{label}</strong>
      {payload.map(({ dataKey, name, value }) => (
        <div key={String(dataKey)}>
          {name} · {typeof value === 'number' ? number.format(value) : value}{' '}
          {options.unit}
        </div>
      ))}
      <div>Отклонение от плана · {difference}</div>
    </div>
  );
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
  connectNulls = false,
  tooltip,
  legendPosition,
  chartTheme,
  animationKey,
}: LineChartProps) {
  const inheritedTheme = useRechartsTheme();
  const themed = chartTheme || inheritedTheme;
  const lineAxis = themed ? { ...axis, tick: { fontSize: 12 } } : axis;
  const matchPoints = useMemo(
    () => (animationKey ? matchByDataKey(animationKey) : undefined),
    [animationKey]
  );
  const lineMotion = animation(motion);
  const chart = (
    <Frame title={title} height={height}>
      <Engine data={data} margin={margin} aria-label={title}>
        {grid && (
          <CartesianGrid
            stroke={themed ? undefined : gridColor}
            strokeDasharray="3 5"
            vertical={false}
          />
        )}
        <XAxis {...lineAxis} dataKey={categoryKey} />
        <YAxis {...lineAxis} width={42} />
        <Tooltip
          contentStyle={themed ? undefined : tooltipStyle}
          itemStyle={themed?.typography}
          isAnimationActive={lineMotion.isAnimationActive}
          formatter={
            tooltip && !tooltip.compare
              ? (value) =>
                  typeof value === 'number'
                    ? number.format(value) + ' ' + tooltip.unit
                    : value
              : undefined
          }
          content={
            tooltip?.compare
              ? (props) => <ComparisonTooltip {...props} options={tooltip} />
              : undefined
          }
        />
        {legendPosition && <Legend verticalAlign={legendPosition} />}
        {series.map((s) => (
          <Line
            key={s.key}
            dataKey={s.key}
            name={s.label}
            type={curve}
            stroke={s.color}
            strokeWidth={strokeWidth}
            strokeDasharray={s.dash}
            dot={dots ? { r: 3 } : false}
            connectNulls={connectNulls}
            animationMatchBy={matchPoints}
            {...lineMotion}
          />
        ))}
      </Engine>
    </Frame>
  );
  return chartTheme ? (
    <RechartsThemeProvider value={chartTheme}>{chart}</RechartsThemeProvider>
  ) : (
    chart
  );
}
