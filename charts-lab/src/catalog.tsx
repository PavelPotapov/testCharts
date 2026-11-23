import { lazy, type ComponentType } from 'react';
import {
  chartColors,
  chartThemes,
  type ThemeName,
} from '@chart-lab/charts/theme';
import { channelPalette, type Channel } from './palette';
import type { LineChartProps } from '@chart-lab/charts/line';
import type { AreaChartProps } from '@chart-lab/charts/area';
import type { BarChartProps } from '@chart-lab/charts/bar';
import type { PieChartProps } from '@chart-lab/charts/pie';
import type { RadarChartProps } from '@chart-lab/charts/radar';
import type { ScatterChartProps } from '@chart-lab/charts/scatter';
import type { TreemapChartProps } from '@chart-lab/charts/treemap';

import type { ComposedChartProps } from '@chart-lab/charts/composed';
import type { RadialChartProps } from '@chart-lab/charts/radial';
import type { FunnelChartProps } from '@chart-lab/charts/funnel';

export const defaults = {
  showActual: true,
  showPlan: true,
  dotRadius: 3,
  activeRadius: 5,
  dotShape: 'circle' as NonNullable<LineChartProps['dotShape']>,
  activeDotAppearance: 'grow' as NonNullable<
    LineChartProps['activeDotAppearance']
  >,
  activeDotDuration: 250,
  tooltipPosition: 'follow' as NonNullable<
    NonNullable<LineChartProps['tooltip']>['position']
  >,
  tooltipAppearance: 'fade' as NonNullable<
    NonNullable<LineChartProps['tooltip']>['appearance']
  >,
  tooltipDuration: 250,
  tooltipSmooth: true,
  hollowDots: false,
  dash: '6 4',
  sweep: 300,
  track: true,
  reversed: false,
  funnelLabels: true,
  tip: 'rectangle' as 'rectangle' | 'triangle',
  color: '',
  secondary: '',
  width: 3,
  height: 310,
  grid: true,
  motion: true,
  duration: 750,
  easing: 'ease-out' as 'ease-out' | 'ease-in-out' | 'linear',
  curve: 'monotone' as 'monotone' | 'step' | 'linear',
  dots: true,
  opacity: 0.24,
  stacked: false,
  barSize: 15,
  radius: 4,
  horizontal: false,
  hole: 52,
  gap: 3,
  startAngle: 90,
  gridType: 'polygon' as 'polygon' | 'circle',
  maxArea: 340,
  shape: 'circle' as 'circle' | 'diamond' | 'square',
  ratio: 1.6,
  theme: 'light' as ThemeName,
  lineOverride: false,
  lineColor: '',
  legendPosition: 'bottom' as
    | NonNullable<LineChartProps['legendPosition']>
    | 'hidden',
  tooltipKind: 'standard' as 'standard' | 'formatted' | 'comparison',
  lineMissing: false,
  connectNulls: false,
  period: 'initial' as 'initial' | 'shifted',
  barMixed: false,
  pieEmpty: false,
};
export type Settings = typeof defaults;
const months = [
  'Янв',
  'Фев',
  'Мар',
  'Апр',
  'Май',
  'Июн',
  'Июл',
  'Авг',
  'Сен',
  'Окт',
  'Ноя',
  'Дек',
];
const sales = [38, 46, 42, 58, 54, 71, 68, 83, 76, 89, 84, 98];
const plan = [30, 32, 39, 36, 47, 50, 46, 60, 64, 61, 70, 74];
const monthly = months.map((month, i) => ({
  month,
  actual: sales[i],
  plan: plan[i],
}));
const linePoints = [
  ...monthly,
  { month: 'След. янв', actual: 94, plan: 82 },
].map((row, index) => ({ id: index + 1, ...row }));
const periods = <T,>(rows: T[]) => ({
  initial: rows.slice(0, 12),
  shifted: rows.slice(1),
});
const lineData = {
  full: periods(linePoints),
  gap: periods(
    linePoints.map((row) =>
      row.month === 'Июн' ? { ...row, actual: null } : row
    )
  ),
};
const mixedBars = monthly.map((row, index) => ({
  ...row,
  actual: [38, -16, 42, 58, -14, 0, 68, -33, 76, -29, 84, 98][index],
  plan: [30, 32, -39, 36, -27, 13, 46, 60, 64, -21, 0, 74][index],
}));
const segments: Channel[] = ['Поиск', 'Партнёры', 'Рассылки', 'Прямые'];
export const stages = ['Визиты', 'Заявки', 'Проверки', 'Сделки'];
const total = [42, 27, 18, 13];
const radar = [
  'Охват',
  'Скорость',
  'Качество',
  'Доступность',
  'Сервис',
  'Отклик',
].map((metric, i) => ({
  metric,
  actual: [82, 62, 76, 88, 56, 75][i],
  plan: [64, 74, 58, 71, 70, 56][i],
}));
const points = sales.map((x, i) => ({
  x,
  y: [62, 45, 54, 75, 43, 60, 81, 66, 74, 58, 88, 79][i],
  z: plan[i],
}));
const tree = segments.map((name, i) => ({ name, size: total[i] }));
const motion = (s: Settings) => ({
  enabled: s.motion,
  duration: s.duration,
  easing: s.easing,
});
const series = (s: Settings) => {
  const colors = chartColors(s.theme, true);
  return [
    { key: 'actual', label: 'Факт', color: s.color || colors.actual },
    {
      key: 'plan',
      label: 'План',
      color: s.secondary || colors.plan,
      strokeColor: s.secondary ? undefined : colors.planStroke,
    },
  ].filter((row) => (row.key === 'actual' ? s.showActual : s.showPlan));
};
const channelColor = (s: Settings, name: Channel) => {
  const override =
    name === 'Поиск' ? s.color : name === 'Партнёры' ? s.secondary : '';
  return override ? { color: override } : channelPalette(s.theme, name);
};
const base = (s: Settings, title: string) => ({
  title,
  height: s.height,
  motion: motion(s),
  chartTheme: chartThemes[s.theme],
});
const cart = (s: Settings) => ({
  ...base(s, 'Динамика продаж'),
  data: monthly,
  categoryKey: 'month',
  series: series(s),
  grid: s.grid,
});

function example<P extends { title: string; data: object[] }>(
  name: string,
  label: string,
  note: string,
  docs: string,
  load: () => Promise<ComponentType<P>>,
  props: (s: Settings) => P
) {
  const Chart = lazy(async () => {
    const Adapter = await load();
    return {
      default: ({ settings }: { settings: Settings }) => (
        <Adapter {...props(settings)} />
      ),
    };
  });
  return {
    name,
    label,
    note,
    docs,
    props,
    render: (s: Settings) => <Chart settings={s} />,
  };
}
export const catalog = {
  line: example<LineChartProps>(
    'LineChart',
    'Линия',
    'Продажи по месяцам · млн ₽',
    'Line',
    async () => (await import('@chart-lab/charts/line')).LineChart,
    (s) => ({
      ...cart(s),
      data: lineData[s.lineMissing ? 'gap' : 'full'][s.period],
      series: [
        {
          key: 'actual',
          label: 'Факт',
          color: s.lineOverride
            ? s.lineColor || chartColors(s.theme, true).custom
            : !s.showPlan
            ? chartColors(s.theme, true).actual
            : undefined,
        },
        {
          key: 'plan',
          label: 'План',
          dash: s.dash || undefined,
          color: !s.showActual
            ? chartColors(s.theme, true).planStroke
            : undefined,
        },
      ].filter((row) => (row.key === 'actual' ? s.showActual : s.showPlan)),
      dotShape: s.dotShape,
      activeDotAppearance: s.activeDotAppearance,
      activeDotDuration: s.activeDotDuration,
      dotRadius: s.dotRadius,
      activeRadius: s.activeRadius,
      hollowDots: s.hollowDots,
      strokeWidth: s.width,
      curve: s.curve,
      dots: s.dots,
      connectNulls: s.lineMissing && s.connectNulls,
      legendPosition:
        s.legendPosition === 'hidden' ? undefined : s.legendPosition,
      tooltip: {
        position: s.tooltipPosition,
        appearance: s.tooltipAppearance,
        duration: s.tooltipDuration,
        smoothTracking: s.tooltipSmooth,
        unit: s.tooltipKind === 'standard' ? undefined : 'млн ₽',
        compare:
          s.tooltipKind === 'comparison' ? ['actual', 'plan'] : undefined,
      },
      animationKey: 'id',
    })
  ),
  area: example<AreaChartProps>(
    'AreaChart',
    'Область',
    'Продажи по месяцам · млн ₽',
    'Area',
    async () => (await import('@chart-lab/charts/area')).AreaChart,
    (s) => ({
      ...cart(s),
      strokeWidth: s.width,
      curve: s.curve,
      opacity: s.opacity,
      stacked: s.stacked,
    })
  ),
  bar: example<BarChartProps>(
    'BarChart',
    'Столбцы',
    'Продажи по месяцам · млн ₽',
    'Bar',
    async () => (await import('@chart-lab/charts/bar')).BarChart,
    (s) => ({
      ...cart(s),
      data: s.barMixed ? mixedBars : monthly,
      barSize: s.barSize,
      radius: s.radius,
      horizontal: s.horizontal,
      stacked: s.stacked,
    })
  ),
  pie: example<PieChartProps>(
    'PieChart',
    'Секторы',
    'Доля каналов · %',
    'Pie',
    async () => (await import('@chart-lab/charts/pie')).PieChart,
    (s) => ({
      ...base(s, 'Источники продаж'),
      data: segments.map((name, i) => ({
        name,
        value: s.pieEmpty ? 0 : total[i],
        ...channelColor(s, name),
      })),
      hole: s.hole,
      gap: s.gap,
      startAngle: s.startAngle,
    })
  ),
  radar: example<RadarChartProps>(
    'RadarChart',
    'Радар',
    'Оценка по шести критериям · баллы',
    'Radar',
    async () => (await import('@chart-lab/charts/radar')).RadarChart,
    (s) => ({
      ...base(s, 'Профиль сервиса'),
      data: radar,
      categoryKey: 'metric',
      series: series(s),
      opacity: s.opacity,
      strokeWidth: s.width,
      grid: s.grid,
      gridType: s.gridType,
    })
  ),
  scatter: example<ScatterChartProps>(
    'ScatterChart',
    'Точки',
    'X — охват, Y — оценка, Z — объём',
    'Scatter',
    async () => (await import('@chart-lab/charts/scatter')).ScatterChart,
    (s) => ({
      ...base(s, 'Сравнение каналов'),
      data: points,
      color: s.color || chartColors(s.theme, true).actual,
      grid: s.grid,
      maxArea: s.maxArea,
      shape: s.shape,
    })
  ),
  treemap: example<TreemapChartProps>(
    'TreemapChart',
    'Дерево',
    'Доля каналов · %',
    'Treemap',
    async () => (await import('@chart-lab/charts/treemap')).TreemapChart,
    (s) => ({
      ...base(s, 'Структура продаж'),
      data: tree.map((tile) => ({
        ...tile,
        color: channelColor(s, tile.name).color,
      })),
      color: s.color || chartColors(s.theme, true).actual,
      ratio: s.ratio,
      strokeWidth: s.width,
    })
  ),
  composed: example<ComposedChartProps>(
    'ComposedChart',
    'Линия и столбцы',
    'Факт и план · млн ₽',
    'ComposedChart',
    async () => (await import('@chart-lab/charts/composed')).ComposedChart,
    (s) => ({
      ...cart(s),
      series: series(s).map((row) => ({
        ...row,
        kind: row.key === 'actual' ? 'bar' : 'line',
      })),
      barSize: s.barSize,
      strokeWidth: s.width,
    })
  ),
  radial: example<RadialChartProps>(
    'RadialChart',
    'Радиальные полосы',
    'Выполнение цели по каналам · %',
    'RadialBar',
    async () => (await import('@chart-lab/charts/radial')).RadialChart,
    (s) => ({
      ...base(s, 'Выполнение цели'),
      data: segments.map((name, i) => ({
        name,
        value: [82, 68, 54, 39][i],
        color: channelColor(s, name).color,
      })),
      sweep: s.sweep,
      thickness: s.barSize,
      track: s.track,
    })
  ),
  funnel: example<FunnelChartProps>(
    'FunnelChart',
    'Воронка',
    'Переходы между этапами · количество',
    'Funnel',
    async () => (await import('@chart-lab/charts/funnel')).FunnelChart,
    (s) => ({
      ...base(s, 'Путь до сделки'),
      data: segments.map((key, i) => ({
        name: stages[i],
        value: [1200, 860, 540, 280][i],
        color: channelColor(s, key).color,
      })),
      reversed: s.reversed,
      labels: s.funnelLabels,
      lastShape: s.tip,
    })
  ),
};
export type Kind = keyof typeof catalog;
export const kinds = Object.keys(catalog) as Kind[];
