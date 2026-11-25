import { useState, type CSSProperties } from 'react';
import { KpiCard, kpiUnits, type KpiAccent, type KpiCardProps } from '@chart-lab/charts/kpi';
import type { ThemeName } from '@chart-lab/charts/theme';
import styles from '@sddsjs/sdds_finai/css/sdds_finai_default.module.css';
import betaStyles from '@sddsjs/sdds_finai/css/sdds_finai_beta_core.module.css';
import './cards.css';

type Kind = 'number' | 'delta' | 'spark' | 'progress';
type View = 'kinds' | 'desk' | 'colors';
type Demo = Omit<KpiCardProps, 'theme' | 'variant'>;

const RUB = kpiUnits.rubMln;
const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя'];
const expenses = [38, 41, 40, 44, 47, 45, 49, 52, 50, 55, 58];

const demos: Record<Kind, Demo> = {
  number: {
    title: 'Плановая численность',
    subtitle: 'на 01.01.2027',
    value: 1318,
    unit: 'ПШЕ',
    note: '14 подразделений',
    accent: 'orchid',
    period: 'Месяц',
  },
  delta: {
    title: 'Финансовый эффект',
    subtitle: 'Заявка, план 2026',
    value: 740,
    unit: RUB,
    compare: { base: 650, label: 'к БП 2026' },
    better: 'up',
    accent: 'blue',
    period: 'Месяц',
  },
  spark: {
    title: 'Расходы на ИТ',
    subtitle: 'Ноябрь 2026',
    value: 58,
    unit: RUB,
    compare: { base: 55, label: 'к октябрю' },
    better: 'down',
    series: months.map((label, i) => ({ label, value: expenses[i] })),
    accent: 'arctic',
    period: 'Месяц',
  },
  progress: {
    title: 'Подтверждённый эффект',
    subtitle: 'Заявка, план 2026',
    value: 510,
    unit: RUB,
    plan: 700,
    accent: 'yellow',
    period: 'Месяц',
  },
};
const kindLabels: Record<Kind, string> = {
  number: 'Число',
  delta: 'Число и разница',
  spark: 'Число и спарклайн',
  progress: 'Число и полоска плана',
};
const kindOrder: Kind[] = ['number', 'delta', 'spark', 'progress'];
const fmtPct = (n: number) => Math.round(n * 100) + '%';

// Цвета группы data в Beta, которые можно дать «Расходам на ИТ». Синий, орхидея и жёлтый
// заняты соседними карточками, зелёный и красный значат «хорошо» и «плохо», серый для фона
const sparkColors: { id: KpiAccent; name: string; hex: string }[] = [
  { id: 'malachite', name: 'Малахит', hex: '#00ABAE' },
  { id: 'electric-blue', name: 'Электрик', hex: '#5792FF' },
  { id: 'fuchsia', name: 'Фуксия', hex: '#E74ACE' },
  { id: 'pink', name: 'Розовый', hex: '#FE4381' },
  { id: 'orange', name: 'Оранжевый', hex: '#F3621C' },
  { id: 'spring', name: 'Весна', hex: '#70AA00' },
  { id: 'arctic', name: 'Арктика, сейчас', hex: '#00B087' },
];

export function Cards() {
  const [view, setView] = useState<View>('desk');
  const [radius, setRadius] = useState(20);
  const [glow, setGlow] = useState(0.35);
  const [buttonGlow, setButtonGlow] = useState(0.6);
  const [pointGlow, setPointGlow] = useState(0.15);
  const [tokens, setTokens] = useState<'default' | 'beta'>('default');
  const [sparkAccent, setSparkAccent] = useState<KpiAccent>('arctic');
  const [fill, setFill] = useState(0.15);
  const [ownColor, setOwnColor] = useState(true);
  const [motion, setMotion] = useState(false);
  const [run, setRun] = useState(0);

  const card = (theme: ThemeName, kind: Kind, variant: 'compact' | 'trend') => {
    const d = demos[kind];
    return (
      <KpiCard
        key={kind + variant + run}
        {...d}
        theme={theme}
        variant={variant}
        accent={ownColor ? (kind === 'spark' ? sparkAccent : d.accent) : ('blue' as KpiAccent)}
        glow={glow}
        buttonGlow={buttonGlow}
        pointGlow={pointGlow}
        fill={fill}
        radius={radius}
        motion={motion}
      />
    );
  };

  const settings: string[] = [];
  if (radius !== 20) settings.push(`radius={${radius}}`);
  if (glow !== 0.35) settings.push(`glow={${glow}}`);
  if (buttonGlow !== 0.6) settings.push(`buttonGlow={${buttonGlow}}`);
  if (pointGlow !== 0.15) settings.push(`pointGlow={${pointGlow}}`);
  if (fill !== 0.15) settings.push(`fill={${fill}}`);
  if (motion) settings.push('motion');
  const code = [
    "import { KpiCard, kpiUnits } from '@chart-lab/charts/kpi';",
    '',
    '<KpiCard',
    '  theme="light"',
    '  variant="trend"',
    '  title="Расходы на ИТ"',
    '  subtitle="Ноябрь 2026"',
    '  value={58}',
    '  unit={kpiUnits.rubMln}',
    "  compare={{ base: 55, label: 'к октябрю' }}",
    '  better="down"',
    "  series={[{ label: 'янв', value: 38 }, /* … */ { label: 'ноя', value: 58 }]}",
    `  accent="${sparkAccent}"`,
    '  period="Месяц"',
    ...settings.map((s) => '  ' + s),
    '/>',
  ].join('\n');

  return (
    <section className="kpi-page">
      <p className="kpi-hint">
        Выбрано 24.11: компактная (полслота) и крупный тренд (слот 250 на 250), прокачка «Свечение». Внутри карточки решают данные: plan даёт полоску плана, series спарклайн, compare разницу, без них просто число
      </p>
      <div className="kpi-controls">
        <div className="kpi-seg" role="group" aria-label="Показ">
          <button aria-pressed={view === 'desk'} onClick={() => setView('desk')}>
            Как на рабочем столе
          </button>
          <button aria-pressed={view === 'kinds'} onClick={() => setView('kinds')}>
            По видам
          </button>
          <button aria-pressed={view === 'colors'} onClick={() => setView('colors')}>
            Цвета «Расходов на ИТ»
          </button>
        </div>
        <label>
          Скругление
          <input type="range" min={8} max={28} value={radius} onChange={(e) => setRadius(+e.target.value)} />
          <output>{radius} px</output>
        </label>
        <label>
          Свечение
          <input type="range" min={0} max={1} step={0.05} value={glow} onChange={(e) => setGlow(+e.target.value)} />
          <output>{fmtPct(glow)}</output>
        </label>
        <label>
          Свечение кнопок
          <input type="range" min={0} max={1} step={0.05} value={buttonGlow} onChange={(e) => setButtonGlow(+e.target.value)} />
          <output>{fmtPct(buttonGlow)}</output>
        </label>
        <label>
          Свечение точки
          <input type="range" min={0} max={1} step={0.05} value={pointGlow} onChange={(e) => setPointGlow(+e.target.value)} />
          <output>{fmtPct(pointGlow)}</output>
        </label>
        <label>
          Заливка под линией
          <input type="range" min={0} max={0.8} step={0.05} value={fill} onChange={(e) => setFill(+e.target.value)} />
          <output>{fmtPct(fill)}</output>
        </label>
        <label>
          <input type="checkbox" checked={ownColor} onChange={(e) => setOwnColor(e.target.checked)} />
          Свой цвет у каждой карточки
        </label>
        <label>
          <input
            type="checkbox"
            checked={motion}
            onChange={(e) => {
              setMotion(e.target.checked);
              setRun((r) => r + 1);
            }}
          />
          Анимация появления
        </label>
        <button className="kpi-replay" disabled={!motion} onClick={() => setRun((r) => r + 1)}>
          Повторить
        </button>
        <div className="kpi-seg" role="group" aria-label="Токены">
          <button aria-pressed={tokens === 'default'} onClick={() => setTokens('default')}>
            Токены FinAI 0.2.1
          </button>
          <button aria-pressed={tokens === 'beta'} onClick={() => setTokens('beta')}>
            Токены Beta
          </button>
        </div>
      </div>
      <div className="kpi-swatches" role="group" aria-label="Цвет «Расходов на ИТ»">
        <span>Цвет «Расходов на ИТ»</span>
        {sparkColors.map((c) => (
          <button key={c.id} aria-pressed={sparkAccent === c.id} onClick={() => setSparkAccent(c.id)}>
            <i style={{ background: c.hex }} />
            {c.name}
          </button>
        ))}
      </div>
      <div className={'kpi-themes kpi-themes-' + view}>
        {(['light', 'dark'] as const).map((theme) => (
          <div key={theme} className={'kpi-stage ' + (tokens === 'beta' ? betaStyles : styles)[theme]} style={{ '--kpi-radius': radius + 'px' } as CSSProperties}>
            <h3>{theme === 'light' ? 'Светлая тема' : 'Тёмная тема'}</h3>
            {view === 'colors' ? (
              <div className="kpi-grid">
                {sparkColors.map((c) => (
                  <figure key={c.id} className="kpi-cell">
                    <figcaption>{c.name}</figcaption>
                    <KpiCard
                      {...demos.spark}
                      theme={theme}
                      variant="trend"
                      accent={c.id}
                      glow={glow}
                      buttonGlow={buttonGlow}
                      pointGlow={pointGlow}
                      fill={fill}
                      radius={radius}
                    />
                  </figure>
                ))}
              </div>
            ) : view === 'desk' ? (
              <div className="kpi-desk">
                <div className="kpi-stack">
                  {card(theme, 'number', 'compact')}
                  {card(theme, 'delta', 'compact')}
                </div>
                {card(theme, 'spark', 'trend')}
                {card(theme, 'progress', 'trend')}
                <div className="kpi-stack">
                  {card(theme, 'spark', 'compact')}
                  {card(theme, 'progress', 'compact')}
                </div>
              </div>
            ) : (
              (['compact', 'trend'] as const).map((variant) => (
                <div key={variant} className="kpi-group">
                  <h4>{variant === 'compact' ? 'Компактная, полслота' : 'Крупный тренд'}</h4>
                  <div className="kpi-grid">
                    {kindOrder.map((kind) => (
                      <figure key={kind} className="kpi-cell">
                        <figcaption>{kindLabels[kind]}</figcaption>
                        {card(theme, kind, variant)}
                      </figure>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ))}
      </div>
      <h3 className="kpi-code-title">Пример кода</h3>
      <pre className="kpi-code">{code}</pre>
    </section>
  );
}
