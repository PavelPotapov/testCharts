import { Suspense, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { catalog, defaults, kinds, type Kind, type Settings } from './catalog';
import { Controls } from './Controls';
import { tableStyle } from './palette';
import sizes from './sizes.json';
import './style.css';

const research =
  'https://github.com/PavelPotapov/testCharts/blob/main/charts-lab/RESEARCH.md';
const kib = (n: number) =>
  (n / 1024).toLocaleString('ru-RU', { maximumFractionDigits: 1 });
const typeLabel: Record<Kind, string> = {
  line: 'Линейный график',
  area: 'График с областями',
  bar: 'Столбчатая диаграмма',
  pie: 'Круговая диаграмма',
  scatter: 'Точечная диаграмма',
  radar: 'Радарная диаграмма',
  treemap: 'Карта дерева',
};

function Bundle() {
  return (
    <section className="panel reading">
      <h2>Стоимость импорта</h2>
      <p>
        Девять независимых production-сборок Vite. Каждая включает React 18.3.1
        и React DOM. Таблица показывает размер минифицированного JavaScript и
        его размер после gzip.
      </p>
      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>Вход потребителя</th>
              <th>JS, КиБ</th>
              <th>gzip, КиБ</th>
              <th>Сверх React, gzip КиБ</th>
              <th>Обёрток</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((r) => (
              <tr key={r.mode}>
                <th>
                  {r.mode === 'react'
                    ? 'Только React'
                    : r.mode === 'all'
                    ? 'Все семь'
                    : typeLabel[r.mode as Kind]}
                </th>
                <td>{kib(r.bytes)}</td>
                <td>{kib(r.gzip)}</td>
                <td>{kib(r.gzip - sizes[0].gzip)}</td>
                <td>{r.wrappers.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>Что попало в импорт линии</h3>
      <p>
        В сборке с <code>@chart-lab/charts/line</code> осталась одна обёртка.
        Среди модулей каталога Recharts <code>chart/</code> сборщик сохранил{' '}
        {sizes.find((r) => r.mode === 'line')?.engines.join(', ')}. Шкалы,
        состояние, оси и подсказка дают заметную общую стоимость уже у первого
        графика.
      </p>
      <p>
        Стенд загружает виды через <code>React.lazy</code> при выборе вкладки.
        Для обычного экрана достаточно статического импорта нужного вида. Для
        загрузки по открытию экрана используйте динамический импорт.
      </p>
      <pre>
        {
          "const Line = lazy(() => import('@chart-lab/charts/line')\n  .then(({ LineChart }) => ({ default: LineChart })));"
        }
      </pre>
      <p>
        Воспроизведение в каталоге <code>charts-lab</code> —{' '}
        <code>pnpm measure</code>. Размер по сети зависит от сборщика
        приложения, кеша и сжатия на сервере.
      </p>
    </section>
  );
}
const rows = [
  [
    'Линия и область',
    'Кривая, разрывы, толщина, маркеры, прозрачность, накопление',
    'type · strokeWidth · dot · connectNulls · stackId',
    'Line',
  ],
  [
    'Столбцы',
    'Группировка и накопление, ширина, радиус углов, горизонтальные полосы',
    'barSize · radius · stackId · layout',
    'Bar',
  ],
  [
    'Круг и кольцо',
    'Сектора, положение центра, отверстие, углы и зазоры',
    'innerRadius · cx · startAngle · paddingAngle',
    'Pie',
  ],
  [
    'Точки и пузыри',
    'Две числовые оси, площадь и форма маркера, произвольный SVG',
    'ZAxis · range · shape',
    'Scatter',
  ],
  [
    'Радар',
    'Заливка профиля, контур, круглая или многоугольная сетка',
    'fillOpacity · strokeWidth · PolarGrid',
    'Radar',
  ],
  [
    'Карта дерева',
    'Пропорции прямоугольников, вложенность, свой рендер ячейки',
    'aspectRatio · dataKey · content',
    'Treemap',
  ],
  [
    'Комбинированный',
    'Линия поверх столбцов, несколько осей, общий tooltip',
    'ComposedChart · yAxisId',
    'ComposedChart',
  ],
  [
    'Специальные',
    'Радиальные столбцы, воронка, потоки, иерархия секторов',
    'RadialBar · Funnel · Sankey · SunburstChart',
    'RadialBar',
  ],
  [
    'Тепловая карта',
    'Нужен адаптер для матрицы X × Y, шкалы цвета и ячеек',
    'Scatter с собственным shape или отдельный SVG',
    'Scatter',
  ],
];
function Research() {
  return (
    <section className="panel reading">
      <h2>Карта возможностей</h2>
      <p>
        Recharts рассчитывает координаты и геометрию. Обёртка переводит токены
        дизайн-системы, настройки серии и форматтеры в свойства компонентов.
      </p>
      <div className="scroll">
        <table>
          <thead>
            <tr>
              <th>Вид</th>
              <th>Возможности</th>
              <th>API движка</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, info, api, doc]) => (
              <tr key={label}>
                <th>{label}</th>
                <td>{info}</td>
                <td>
                  <a href={'https://recharts.github.io/en-US/api/' + doc + '/'}>
                    {api}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>Что дать командам</h3>
      <p>
        Один типизированный вход на вид. В общем контракте — данные, доступное
        название, высота и анимация. Для рядов — ключ категории, ключи серий и
        роли цветов. Для долей, точек и деревьев нужны собственные схемы данных.
        Тема отвечает за оси, сетку, типографику и палитру.
      </p>
      <p>
        Расширения удобно вводить от простого к сложному: формат значения,
        содержимое подсказки и легенды, затем собственная SVG-фигура. Контракт
        слота может возвращать исходную строку и идентификатор серии.
      </p>
      <a href={research}>Полное исследование и проект API</a>
    </section>
  );
}
function DataTable({ data }: { data: object[] }) {
  const keys = [...new Set(data.flatMap((row) => Object.keys(row)))];
  return (
    <div className="scroll">
      <table>
        <thead>
          <tr>
            {keys.map((k) => (
              <th key={k}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {keys.map((key) => {
                const value = (row as Record<string, unknown>)[key];
                return <td key={key}>{value == null ? '—' : String(value)}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Lab() {
  const [kind, setKind] = useState<Kind>('line');
  const [s, set] = useState<Settings>({ ...defaults });
  const [page, setPage] = useState('Лаборатория');
  const [tab, setTab] = useState('Пример кода');
  const [repeat, replay] = useState(0);
  const item = catalog[kind];
  const { data, chartTheme: _theme, ...props } = item.props(s);
  const code =
    'import { ' +
    item.name +
    " } from '@chart-lab/charts/" +
    kind +
    "';\n" +
    "import { chartThemes } from '@chart-lab/charts/theme';\n\n" +
    'export function Example() {\n  return <' +
    item.name +
    '\n    data={data}\n' +
    '    chartTheme={chartThemes.' +
    s.theme +
    '}\n' +
    Object.entries(props)
      .filter(([, value]) => value !== undefined)
      .map(
        ([key, value]) =>
          '    ' +
          key +
          '={' +
          JSON.stringify(value, null, 2).replaceAll('\n', '\n    ') +
          '}'
      )
      .join('\n') +
    '\n  />;\n}\n\n' +
    'const data = [\n' +
    data.map((row) => '  ' + JSON.stringify(row)).join(',\n') +
    '\n];';
  const series = 'series' in props ? props.series : null;
  const categoryData =
    kind === 'pie' && !s.pieEmpty
      ? catalog.pie.props(s).data
      : kind === 'treemap'
      ? catalog.treemap.props(s).data
      : [];
  const legend =
    kind === 'line'
      ? []
      : series ??
        categoryData.map((entry) => ({
          color: entry.color,
          label: entry.name,
        }));
  return (
    <div className="lab" style={tableStyle(s.theme)}>
      <header className="mast">
        <div className="wrap mastin">
          <div className="brand">
            <span className="mark" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
            Атлас графиков
          </div>
          <a href="https://github.com/PavelPotapov/testCharts">GitHub</a>
        </div>
      </header>
      <main className="wrap">
        <header className="hero">
          <div>
            <div className="eyebrow">RECHARTS / 3.11.0</div>
            <h1>Лаборатория графиков</h1>
            <p>Настройте график, посмотрите код и оцените стоимость импорта.</p>
          </div>
        </header>
        <nav className="nav" aria-label="Разделы">
          {['Лаборатория', 'Возможности', 'Размер импорта'].map((n) => (
            <button
              key={n}
              aria-pressed={page === n}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
        </nav>
        {page === 'Лаборатория' ? (
          <>
            <div className="types" aria-label="Вид графика">
              {kinds.map((k) => (
                <button
                  key={k}
                  aria-pressed={k === kind}
                  onClick={() => setKind(k)}
                >
                  {catalog[k].label}
                </button>
              ))}
            </div>
            <div className="workspace">
              <div className="viewer">
                <section className="panel plot">
                  <header>
                    <div>
                      <div className="eyebrow">{typeLabel[kind]}</div>
                      <h2>{props.title}</h2>
                      <p>{item.note}</p>
                    </div>
                    <button
                      className="replay"
                      disabled={!s.motion || (kind === 'pie' && s.pieEmpty)}
                      onClick={() => replay((r) => r + 1)}
                    >
                      Повторить анимацию
                    </button>
                  </header>
                  <div className="canvas" key={kind + repeat}>
                    <Suspense
                      fallback={
                        <p role="status" style={{ height: s.height }}>
                          Загрузка графика…
                        </p>
                      }
                    >
                      {item.render(s)}
                    </Suspense>
                  </div>
                  {legend.length > 0 && (
                    <div className="legend">
                      {legend.map((series) => (
                        <span key={series.label}>
                          <i style={{ background: series.color }} />
                          {series.label}
                        </span>
                      ))}
                    </div>
                  )}
                </section>
                <section className="panel details">
                  <header>
                    <div className="subtabs">
                      {['Пример кода', 'Данные'].map((t) => (
                        <button
                          key={t}
                          aria-pressed={tab === t}
                          onClick={() => setTab(t)}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <div className="details-links">
                      <a
                        href={
                          'https://github.com/PavelPotapov/testCharts/blob/main/charts-lab/charts/' +
                          kind +
                          '.tsx'
                        }
                      >
                        Код адаптера
                      </a>
                      <a
                        href={
                          'https://recharts.github.io/en-US/api/' +
                          item.docs +
                          '/'
                        }
                      >
                        API Recharts
                      </a>
                    </div>
                  </header>
                  {tab === 'Пример кода' ? (
                    <pre>{code}</pre>
                  ) : (
                    <DataTable data={data} />
                  )}
                </section>
              </div>
              <Controls kind={kind} settings={s} onChange={set} />
            </div>
          </>
        ) : page === 'Возможности' ? (
          <Research />
        ) : (
          <Bundle />
        )}
      </main>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Lab />);
