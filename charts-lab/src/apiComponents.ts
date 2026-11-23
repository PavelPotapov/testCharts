import type { Kind } from './catalog';

const cartesian = [
  'CartesianGrid',
  'XAxis',
  'YAxis',
  'ReferenceLine',
  'ReferenceArea',
  'ReferenceDot',
  'Brush',
];
const polar = ['PolarGrid', 'PolarAngleAxis', 'PolarRadiusAxis'];
const common = ['Tooltip', 'Legend', 'Label', 'LabelList'];
const parts: Record<Kind, string[]> = {
  line: ['LineChart', 'Line', ...cartesian, 'ErrorBar'],
  area: ['AreaChart', 'Area', ...cartesian],
  bar: ['BarChart', 'Bar', 'BarStack', ...cartesian, 'ErrorBar'],
  composed: [
    'ComposedChart',
    'Line',
    'Area',
    'Bar',
    'BarStack',
    'Scatter',
    ...cartesian,
    'ZAxis',
    'ErrorBar',
  ],
  scatter: ['ScatterChart', 'Scatter', 'ZAxis', ...cartesian, 'ErrorBar'],
  radar: ['RadarChart', 'Radar', ...polar],
  pie: ['PieChart', 'Pie'],
  radial: ['RadialBarChart', 'RadialBar', ...polar],
  funnel: ['FunnelChart', 'Funnel'],
  treemap: ['Treemap'],
};
export const apiComponents = (kind: Kind) => [...parts[kind], ...common];
