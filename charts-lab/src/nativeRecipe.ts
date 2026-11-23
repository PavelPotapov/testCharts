import type { Kind } from './catalog';
export interface Recipe {
  component: string;
  props?: Record<string, unknown>;
  children?: Recipe[];
}
const n = (
  component: string,
  props?: Recipe['props'],
  children?: Recipe[]
): Recipe => ({ component, props, children });
export function nativeRecipe(kind: Kind): Recipe {
  const x = n('XAxis', { dataKey: 'month' }),
    y = n('YAxis', { width: 40 }),
    grid = n('CartesianGrid', { strokeDasharray: '3 5' }),
    tip = n('Tooltip');
  const line = n('Line', {
    dataKey: 'plan',
    name: 'План',
    type: 'monotone',
    stroke: 'var(--inverse-data-yellow)',
    strokeDasharray: '6 4',
    dot: { symbol: 'diamond', r: 4 },
  });
  const bar = n('Bar', {
    dataKey: 'actual',
    name: 'Факт',
    fill: 'var(--data-blue)',
    radius: 5,
  });
  const axisCharts = {
    line: 'LineChart',
    area: 'AreaChart',
    bar: 'BarChart',
    composed: 'ComposedChart',
  } as const;
  if (kind in axisCharts) {
    const series =
      kind === 'line'
        ? [
            n('Line', {
              ...line.props,
              dataKey: 'actual',
              name: 'Факт',
              stroke: 'var(--data-blue)',
              strokeDasharray: 'none',
            }),
            line,
          ]
        : kind === 'area'
        ? [
            n('Area', {
              dataKey: 'actual',
              type: 'monotone',
              fill: 'var(--data-blue)',
              fillOpacity: 0.3,
              stroke: 'var(--data-blue)',
              dot: { r: 4 },
              activeDot: { r: 7 },
            }),
          ]
        : kind === 'bar'
        ? [bar]
        : [bar, line];
    return n(
      axisCharts[kind as keyof typeof axisCharts],
      { data: '$data', margin: { top: 16, right: 16, bottom: 0, left: 0 } },
      [grid, x, y, ...series, tip]
    );
  }
  switch (kind) {
    case 'pie':
      return n('PieChart', {}, [
        n('Pie', {
          data: '$data',
          dataKey: 'value',
          nameKey: 'name',
          innerRadius: '50%',
          outerRadius: '82%',
          cornerRadius: 8,
          paddingAngle: 3,
        }),
        tip,
      ]);
    case 'radar':
      return n('RadarChart', { data: '$data', outerRadius: '75%' }, [
        n('PolarGrid', { gridType: 'polygon' }),
        n('PolarAngleAxis', { dataKey: 'metric' }),
        n('Radar', {
          dataKey: 'actual',
          fill: 'var(--data-blue)',
          fillOpacity: 0.3,
          stroke: 'var(--data-blue)',
          dot: true,
        }),
        tip,
      ]);
    case 'scatter':
      return n('ScatterChart', {}, [
        grid,
        n('XAxis', { type: 'number', dataKey: 'x' }),
        n('YAxis', { type: 'number', dataKey: 'y' }),
        n('ZAxis', { dataKey: 'z', range: [30, 300] }),
        n('Scatter', {
          data: '$data',
          fill: 'var(--data-blue)',
          shape: 'diamond',
        }),
        tip,
      ]);
    case 'radial':
      return n(
        'RadialBarChart',
        {
          data: '$data',
          innerRadius: '20%',
          outerRadius: '90%',
          startAngle: 90,
          endAngle: -210,
        },
        [
          n('PolarAngleAxis', {
            type: 'number',
            domain: [0, 100],
            tick: false,
          }),
          n('RadialBar', {
            dataKey: 'value',
            cornerRadius: 6,
            background: true,
          }),
          tip,
        ]
      );
    case 'funnel':
      return n('FunnelChart', {}, [
        n(
          'Funnel',
          {
            data: '$data',
            dataKey: 'value',
            nameKey: 'name',
            lastShapeType: 'rectangle',
          },
          [n('LabelList', { dataKey: 'name', position: 'center' })]
        ),
        tip,
      ]);
    default:
      return n(
        'Treemap',
        {
          data: '$data',
          dataKey: 'size',
          nameKey: 'name',
          aspectRatio: 1.6,
          stroke: 'var(--surface-solid-card)',
          fill: 'var(--data-blue)',
        },
        [tip]
      );
  }
}
