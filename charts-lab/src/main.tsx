import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { createRoot } from 'react-dom/client';
import {
  catalog,
  initialSettings,
  kinds,
  themeOverrides,
  type Kind,
  type Settings,
} from './catalog';

const NativeEditor = lazy(() => import('./NativeEditor'));
const Showcase = lazy(() =>
  import('./Showcase').then((m) => ({ default: m.Showcase }))
);
const Capabilities = lazy(() =>
  import('./Capabilities').then((m) => ({ default: m.Capabilities }))
);
const Cards = lazy(() =>
  import('./Cards').then((m) => ({ default: m.Cards }))
);
import { Controls } from './Controls';
import { PresetBar } from './PresetBar';
import { loadSaved, saveSettings, type ByKind } from './presets';
import { tableStyle } from './palette';
import sizes from './sizes.json';
import styles from '@sddsjs/sdds_finai/css/sdds_finai_default.module.css';
import './style.css';

const kib = (n: number) =>
  (n / 1024).toLocaleString('ru-RU', { maximumFractionDigits: 1 });
const typeLabel: Record<Kind | 'kpi', string> = {
  kpi: 'Карточка KPI',
  composed: 'Комбинированная диаграмма',
  radial: 'Радиальная диаграмма',
  funnel: 'Воронка',
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
        Количество независимых production-сборок Vite — {sizes.length}. Каждая
        включает React 18.3.1 и React DOM. Таблица показывает размер
        минифицированного JavaScript и его размер после gzip. Общий CSS двух тем
        SDDS и интерфейса стенда загружается отдельным файлом.
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
                    ? 'Все компоненты'
                    : typeLabel[r.mode as keyof typeof typeLabel]}
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
        В лаборатории <code>React.lazy</code> загружает выбранный вид. На
        витрине графики подгружаются по мере прокрутки. Для обычного экрана
        достаточно статического импорта нужного вида. Для загрузки по открытию
        экрана используйте динамический импорт.
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
const sections = [
  { hash: '#showcase', label: 'Витрина' },
  { hash: '#lab', label: 'Лаборатория' },
  { hash: '#cards', label: 'Карточки' },
  { hash: '#capabilities', label: 'Возможности' },
  { hash: '#sizes', label: 'Размер импорта' },
] as const;

function subscribeToSection(notify: () => void) {
  window.addEventListener('hashchange', notify);
  return () => window.removeEventListener('hashchange', notify);
}

function currentSection() {
  return (
    sections.find(({ hash }) => hash === window.location.hash) ?? sections[0]
  );
}

function Lab() {
  const [saved] = useState(loadSaved);
  const [kind, setKind] = useState<Kind>('line');
  const [theme, setTheme] = useState<Settings['theme']>(saved.theme ?? 'light');
  const [byKind, setByKind] = useState<ByKind>(saved.byKind);
  useEffect(() => saveSettings(theme, byKind), [theme, byKind]);
  const s = { ...(byKind[kind] ?? initialSettings(kind)), theme };
  const set = (next: Settings) =>
    setByKind((previous) => ({ ...previous, [kind]: next }));
  const page = useSyncExternalStore(subscribeToSection, currentSection);
  const [tab, setTab] = useState('Пример кода');
  const [repeat, replay] = useState(0);
  const labTab = useRef<HTMLButtonElement>(null);
  function openLab(next: Kind) {
    setKind(next);
    window.location.hash = '#lab';
    labTab.current?.focus();
  }
  const item = catalog[kind];
  const { data, chartTheme: _theme, ...props } = item.props(s);
  const overrides = Object.entries(themeOverrides(s));
  const baseTheme = 'chartThemes.' + s.theme;
  const themeCode = overrides.length
    ? [
        '{',
        '      ...' + baseTheme + ',',
        ...overrides.map(
          ([key, value]) =>
            '      ' +
            key +
            ': ' +
            JSON.stringify(value, null, 2).replaceAll('\n', '\n      ') +
            ','
        ),
        '    }',
      ].join('\n')
    : baseTheme;
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
    '    chartTheme={' +
    themeCode +
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
  return (
    <div className={`lab ${styles[s.theme]}`} style={tableStyle(s.theme)}>
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
          <div className="mast-actions">
            <label>
              Тема{' '}
              <select
                aria-label="Тема таблицы и графика"
                value={s.theme}
                onChange={(e) =>
                  setTheme(e.target.value === 'dark' ? 'dark' : 'light')
                }
              >
                <option value="light">Светлая</option>
                <option value="dark">Тёмная</option>
              </select>
            </label>
            <a href="https://github.com/PavelPotapov/testCharts">GitHub</a>
          </div>
        </div>
      </header>
      <main className="wrap">
        <header className="hero">
          <div>
            <div className="eyebrow">RECHARTS / 3.11.0</div>
            <h1>
              {page.hash === '#showcase'
                ? 'Витрина графиков'
                : page.hash === '#cards'
                ? 'Карточки с числами'
                : 'Лаборатория графиков'}
            </h1>
            <p>
              {page.hash === '#showcase'
                ? 'Выберите график, чтобы открыть его настройки в лаборатории.'
                : page.hash === '#cards'
                ? 'Компактная и крупный тренд в выбранном виде, светлая и тёмная тема рядом.'
                : 'Настройте график, посмотрите код и оцените стоимость импорта.'}
            </p>
          </div>
        </header>
        <nav className="nav" aria-label="Разделы">
          {sections.map(({ hash, label }) => (
            <button
              key={hash}
              ref={hash === '#lab' ? labTab : undefined}
              aria-pressed={page.hash === hash}
              onClick={() => {
                window.location.hash = hash;
              }}
            >
              {label}
            </button>
          ))}
        </nav>
        {page.hash === '#showcase' ? (
          <Suspense fallback={<p role="status">Загрузка витрины…</p>}>
            <Showcase theme={s.theme} openLab={openLab} />
          </Suspense>
        ) : page.hash === '#lab' ? (
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
            <PresetBar
              kind={kind}
              theme={s.theme}
              byKind={byKind}
              onImport={(nextTheme, imported, first) => {
                setByKind((previous) => ({ ...previous, ...imported }));
                if (nextTheme) setTheme(nextTheme);
                if (first && !imported[kind]) setKind(first);
              }}
            />
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
                </section>
                <section className="panel details">
                  <header>
                    <div className="subtabs">
                      {['Пример кода', 'Данные', 'Редактор Recharts'].map(
                        (t) => (
                          <button
                            key={t}
                            aria-pressed={tab === t}
                            onClick={() => setTab(t)}
                          >
                            {t}
                          </button>
                        )
                      )}
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
                  ) : tab === 'Редактор Recharts' ? (
                    <Suspense
                      fallback={<p role="status">Загрузка редактора…</p>}
                    >
                      <NativeEditor
                        key={kind}
                        kind={kind}
                        settings={s}
                        data={data}
                        onChange={set}
                      />
                    </Suspense>
                  ) : (
                    <DataTable data={data} />
                  )}
                </section>
              </div>
              <Controls kind={kind} settings={s} onChange={set} />
            </div>
          </>
        ) : page.hash === '#cards' ? (
          <Suspense fallback={<p role="status">Загрузка карточек…</p>}>
            <Cards />
          </Suspense>
        ) : page.hash === '#capabilities' ? (
          <Suspense
            fallback={<p role="status">Загрузка карты возможностей…</p>}
          >
            <Capabilities initial={kind} openLab={openLab} />
          </Suspense>
        ) : (
          <Bundle />
        )}
      </main>
    </div>
  );
}
createRoot(document.getElementById('root')!).render(<Lab />);
