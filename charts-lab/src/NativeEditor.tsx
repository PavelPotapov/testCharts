import {
  Component,
  createElement,
  useState,
  type ElementType,
  type ReactNode,
} from 'react';
import {
  ResponsiveContainer,
  RechartsThemeProvider,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  BarStack,
  ComposedChart,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  FunnelChart,
  Funnel,
  Treemap,
  CartesianGrid,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
  ReferenceArea,
  ReferenceDot,
  Brush,
  ErrorBar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  Label,
  LabelList,
} from 'recharts';
import { chartThemes } from '@chart-lab/charts/theme';
import { nativeRecipe, parseNativeRecipe, type Recipe } from './nativeRecipe';
import { ApiReference } from './ApiReference';
import type { Kind, Settings } from './catalog';
const registry: Record<string, ElementType> = {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  BarStack,
  ComposedChart,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  FunnelChart,
  Funnel,
  Treemap,
  CartesianGrid,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
  ReferenceArea,
  ReferenceDot,
  Brush,
  ErrorBar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  Legend,
  Label,
  LabelList,
};
function render(node: Recipe, data: object[], key = 0): React.ReactElement {
  const props = { ...node.props };
  if (props.data === '$data') props.data = data;
  return createElement(
    registry[node.component],
    { ...props, key },
    ...(node.children?.map((child, i) => render(child, data, i)) ?? [])
  );
}
class PreviewBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <p role="alert">
        Recharts не смог отрисовать эти свойства. Исправьте пример или
        восстановите исходный.
      </p>
    ) : (
      this.props.children
    );
  }
}
export default function NativeEditor({
  kind,
  settings: s,
  data,
  onChange,
}: {
  kind: Kind;
  settings: Settings;
  data: object[];
  onChange: (s: Settings) => void;
}) {
  const [error, setError] = useState('');
  const original = JSON.stringify(nativeRecipe(kind), null, 2);
  const applied = s.nativeApplied || original;
  const draft = s.nativeDraft || (!s.nativeApplied ? original : '');
  const rows = data.map((row) =>
    'color' in row ? { ...row, fill: row.color } : row
  );
  return (
    <section className="native-editor">
      <h3>Редактор Recharts</h3>
      <p>
        Это отдельный пример на данных выбранного графика. В JSON задайте
        компонент, его свойства и дочерние элементы. <code>$data</code>{' '}
        подставляет записи из лаборатории. Например, можно добавить порог через
        ReferenceLine или поменять радиусы сектора.
      </p>
      <PreviewBoundary key={kind + applied}>
        <RechartsThemeProvider value={chartThemes[s.theme]}>
          <div style={{ height: 280, minWidth: 0 }} className="native-preview">
            <ResponsiveContainer width="100%" height="100%">
              {render(parseNativeRecipe(applied, kind), rows)}
            </ResponsiveContainer>
          </div>
        </RechartsThemeProvider>
      </PreviewBoundary>
      <label>
        Конфигурация Recharts
        <textarea
          spellCheck={false}
          value={draft}
          onChange={(e) => {
            setError('');
            onChange({
              ...s,
              nativeDraft: e.target.value,
              nativeApplied: applied,
            });
          }}
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <div className="guide-actions">
        <button
          className="replay"
          onClick={() => {
            try {
              parseNativeRecipe(draft, kind);
              setError('');
              onChange({ ...s, nativeDraft: draft, nativeApplied: draft });
            } catch (e) {
              setError(String(e instanceof Error ? e.message : e));
            }
          }}
        >
          Применить
        </button>
        <button
          className="text"
          onClick={() => {
            setError('');
            onChange({ ...s, nativeDraft: '', nativeApplied: '' });
          }}
        >
          Восстановить пример
        </button>
      </div>
      <ApiReference kind={kind} />
    </section>
  );
}
