import { useEffect, useId, useState, type CSSProperties, type ReactNode } from 'react';
import { Area, AreaChart, Bar, BarChart, ReferenceDot, ReferenceLine, XAxis, YAxis } from 'recharts';
import { dataPaint, type ThemeName } from './theme.js';

// Карточка с числом для дашборда. Два вида: компактная (полслота, 119 px)
// и крупный тренд (слот 250 на 250). Что внутри, решают данные: plan даёт полоску
// плана, series даёт спарклайн, compare даёт разницу, без них просто число

/** Запись рубля задаётся только здесь. «млн ₽» или «млн руб.» выберут по виду позже */
export const kpiUnits = { rubMln: 'млн ₽', rubBln: 'млрд ₽' } as const;

export type KpiVariant = 'compact' | 'trend';
export type KpiAccent =
  | 'blue'
  | 'electric-blue'
  | 'malachite'
  | 'arctic'
  | 'green'
  | 'spring'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'pink'
  | 'fuchsia'
  | 'orchid'
  | 'gray';

export interface KpiPoint {
  label: string;
  value: number;
}
export interface KpiCompare {
  /** Значение базы: план, прошлый период */
  base: number;
  /** Как назвать базу: «к БП 2026», «к октябрю» */
  label: string;
}

export interface KpiCardProps {
  theme: ThemeName;
  /** compact: полслота, trend: слот 250 на 250. По умолчанию trend */
  variant?: KpiVariant;
  title: string;
  /** Период и разрез: «Заявка, план 2026» */
  subtitle?: string;
  value: number;
  unit?: string;
  /** Знаков после запятой у главного числа, по умолчанию 0 */
  digits?: number;
  /** Сравнение с планом или прошлым периодом */
  compare?: KpiCompare;
  /** Смысл показателя для цвета разницы. Без него разница серая */
  better?: 'up' | 'down';
  /** Спарклайн, последняя точка равна value */
  series?: KpiPoint[];
  /** План для полоски исполнения, полная длина полоски равна плану */
  plan?: number;
  /** Подпись внизу крупной карточки с одним числом */
  note?: string;
  /** Цвет карточки из группы data */
  accent?: KpiAccent;
  /** Текст переключателя периода в крупной карточке. Без него переключателя нет */
  period?: string;
  /** Свечение карточки, линии и точек 0-1, по умолчанию 0,35 */
  glow?: number;
  /** Свечение под круглой кнопкой 0-1, по умолчанию 0,6 */
  buttonGlow?: number;
  /** Свечение последней точки спарклайна 0-1, по умолчанию 0,15 */
  pointGlow?: number;
  /** Заливка под линией 0-1, по умолчанию 0,15 */
  fill?: number;
  /** Скругление карточки, по умолчанию 20 */
  radius?: number;
  /** Ширина карточки, по умолчанию 250 */
  width?: number;
  /** Анимация появления, по умолчанию выключена */
  motion?: boolean;
  onOpen?: () => void;
  onPeriodClick?: () => void;
}

const fallback = {
  light: {
    text: '#13181BF5',
    secondary: '#485056B0',
    tertiary: '#707C847A',
    card: '#FFFFFF',
    solidCard: '#FFFFFF',
    track: '#ADB9C238',
    positive: '#108E26',
    negative: '#E31227',
  },
  dark: {
    text: '#F2F5F8F5',
    secondary: '#D5DFE69E',
    tertiary: '#D5DFE64D',
    card: '#FFFFFF0F',
    solidCard: '#060A0C',
    track: '#D5DFE624',
    positive: '#24B23E',
    negative: '#FF3D51',
  },
};

function ui(theme: ThemeName) {
  const f = fallback[theme];
  return {
    text: `var(--text-primary, ${f.text})`,
    secondary: `var(--text-secondary, ${f.secondary})`,
    tertiary: `var(--text-tertiary, ${f.tertiary})`,
    card: `var(--surface-transparent-card, ${f.card})`,
    solidCard: `var(--surface-solid-card, ${f.solidCard})`,
    track: `var(--surface-transparent-secondary, ${f.track})`,
    good: `var(--text-positive, ${f.positive})`,
    bad: `var(--text-negative, ${f.negative})`,
  };
}

// Группа data, значения по умолчанию из Beta (@sddsjs/sdds_finai, sdds_finai_beta_core):
// светлый цвет, его тёмная пара inverse, яркий цвет тёмной темы. Переменные SDDS на странице важнее
const accents: Record<Exclude<KpiAccent, 'blue'>, [string, string, string]> = {
  'electric-blue': ['#5792FF', '#2067EC', '#5792FF'],
  malachite: ['#00ABAE', '#008385', '#00ABAE'],
  arctic: ['#00B087', '#0F8667', '#00B087'],
  green: ['#20B43A', '#1C892D', '#20B43A'],
  spring: ['#70AA00', '#548200', '#70AA00'],
  yellow: ['#C88700', '#9A6700', '#C88700'],
  orange: ['#F3621C', '#BF4500', '#F3621C'],
  red: ['#FF4B59', '#D60033', '#FF4B59'],
  pink: ['#FE4381', '#D1005E', '#FE4381'],
  fuchsia: ['#E74ACE', '#C000A9', '#E74ACE'],
  orchid: ['#BF62FD', '#9E28DF', '#BF62FD'],
  gray: ['#8B98A2', '#66757F', '#8B98A2'],
};

function paints(theme: ThemeName, accent: KpiAccent) {
  if (accent === 'blue') {
    const blue = dataPaint(theme, 'data-blue');
    return { fill: blue, stroke: blue };
  }
  // В светлой теме для линий и точек берём тёмную пару inverse, в тёмной яркую:
  // так цвет читается на карточке и свечение видно
  const [light, lightInverse, darkBright] = accents[accent];
  if (theme === 'dark') {
    const bright = `var(--inverse-data-${accent}, ${darkBright})`;
    return { fill: bright, stroke: bright };
  }
  return {
    fill: `var(--data-${accent}, ${light})`,
    stroke: `var(--inverse-data-${accent}, ${lightInverse})`,
  };
}

const mix = (color: string, pct: number) =>
  `color-mix(in oklch, ${color} ${Math.round(pct)}%, transparent)`;

/** Числа по редполитике ДС: разряды пробелом с пяти цифр, запятая в дробях */
export function formatKpiNumber(n: number, digits = 0) {
  return new Intl.NumberFormat('ru-RU', {
    useGrouping: 'min2',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  } as unknown as Intl.NumberFormatOptions).format(n);
}
const fmt = formatKpiNumber;
function signed(n: number, digits = 0) {
  return (n > 0 ? '+' : n < 0 ? '-' : '') + fmt(Math.abs(n), digits);
}

function useCount(target: number, motion: boolean) {
  const [value, setValue] = useState(motion ? 0 : target);
  useEffect(() => {
    if (!motion) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const k = Math.max(0, Math.min(1, (now - start) / 900));
      setValue(target * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, motion]);
  return value;
}

function Arrow({ up, diagonal, size = 14 }: { up: boolean; diagonal?: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      aria-hidden="true"
      style={{ transform: up ? undefined : 'scaleY(-1)', flex: 'none' }}
    >
      <path
        d={diagonal ? 'M4 12 12 4M6 4h6v6' : 'M8 13V3M4 7l4-4 4 4'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const button: CSSProperties = {
  border: 0,
  padding: 0,
  margin: 0,
  font: 'inherit',
  cursor: 'pointer',
  display: 'grid',
  placeItems: 'center',
  flex: 'none',
};

function DotColumns({ series, color, glow, motion }: { series: KpiPoint[]; color: string; glow: number; motion: boolean }) {
  const id = useId().replace(/:/g, '');
  const last = series.length - 1;
  return (
    <BarChart width={66} height={44} data={series} margin={{ top: 2, right: 2, bottom: 0, left: 2 }} barCategoryGap="12%">
      <defs>
        <filter id={'d' + id} x="-1" y="-1" width="3" height="3">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor={color} floodOpacity={glow * 0.9} />
        </filter>
      </defs>
      <XAxis dataKey="label" hide />
      <YAxis hide domain={[0, 'dataMax']} />
      <Bar
        dataKey="value"
        isAnimationActive={motion}
        animationDuration={900}
        shape={(p: unknown) => {
          const { x = 0, y = 0, width: w = 0, height: h = 0, index = 0 } = p as Record<string, number>;
          const cell = Math.min(w / 2, 3);
          const r = cell - 0.4;
          const step = cell * 2 + 0.6;
          const count = Math.max(1, Math.round(h / step));
          return (
            <g key={index} filter={glow > 0 ? `url(#d${id})` : undefined} opacity={index === last ? 1 : 0.92}>
              {Array.from({ length: count }, (_, i) => (
                <circle key={i} cx={x + w / 2} cy={y + h - step / 2 - i * step} r={r} fill={color} />
              ))}
            </g>
          );
        }}
      />
    </BarChart>
  );
}

function DotProgress({ share, color, track, glow, width }: { share: number; color: string; track: string; glow: number; width: number }) {
  const id = useId().replace(/:/g, '');
  const total = 20;
  const filled = Math.round(Math.min(share, 1) * total);
  return (
    <svg width={width} height="12" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <filter id={'p' + id} x="-1" y="-1" width="3" height="3">
          <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor={color} floodOpacity={glow * 0.9} />
        </filter>
      </defs>
      {Array.from({ length: total }, (_, i) => (
        <circle
          key={i}
          cx={6 + i * ((width - 12) / (total - 1))}
          cy={6}
          r={4}
          fill={i < filled ? color : track}
          filter={i < filled && glow > 0 ? `url(#p${id})` : undefined}
        />
      ))}
    </svg>
  );
}

function TrendArea({
  series,
  color,
  ring,
  glow,
  pointGlow,
  fill,
  motion,
  width,
}: {
  series: KpiPoint[];
  color: string;
  ring: string;
  glow: number;
  pointGlow: number;
  fill: number;
  motion: boolean;
  width: number;
}) {
  const id = useId().replace(/:/g, '');
  const last = series.length - 1;
  const top = Math.min(1, fill * 1.4);
  // Recharts не даёт svg выходить за край, поэтому вокруг графика прозрачный запас
  // под свечение, а сам блок сдвинут назад: линия стоит там же, где без запаса
  const pad = 16;
  return (
    <div style={{ margin: -pad }}>
    <AreaChart
      width={width + pad * 2}
      height={64 + pad * 2}
      data={series}
      margin={{ top: 12 + pad, right: 10 + pad, bottom: 2 + pad, left: pad }}
    >
      <defs>
        <linearGradient id={'f' + id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={top} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
        <filter id={'g' + id} x="-0.2" y="-1" width="1.4" height="3">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor={color} floodOpacity={glow * 0.9} />
        </filter>
        <filter id={'b' + id} x="-2" y="-2" width="5" height="5">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <XAxis dataKey="label" hide />
      <YAxis hide domain={['dataMin - 6', 'dataMax']} />
      <ReferenceLine x={series[last]?.label} stroke={color} strokeDasharray="2 3" strokeOpacity={0.6} />
      {glow > 0 && (
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill="none"
          filter={`url(#g${id})`}
          isAnimationActive={motion}
          animationDuration={900}
          activeDot={false}
          dot={false}
        />
      )}
      <Area
        type="monotone"
        dataKey="value"
        stroke={color}
        strokeWidth={2}
        fill={`url(#f${id})`}
        isAnimationActive={motion}
        animationDuration={900}
        activeDot={false}
        dot={false}
      />
      <ReferenceDot
        x={series[last]?.label}
        y={series[last]?.value}
        r={4}
        ifOverflow="visible"
        shape={(p: { cx?: number; cy?: number }) => (
          <g>
            {pointGlow > 0 && (
              <circle cx={p.cx} cy={p.cy} r={12} fill={color} opacity={pointGlow * 0.9} filter={`url(#b${id})`} />
            )}
            <circle cx={p.cx} cy={p.cy} r={4.5} fill={color} stroke={ring} strokeWidth={2} />
          </g>
        )}
      />
    </AreaChart>
    </div>
  );
}

function TrendBar({ share, color, track, ring, glow, motion }: { share: number; color: string; track: string; ring: string; glow: number; motion: boolean }) {
  const target = Math.min(share, 1) * 100;
  const [width, setWidth] = useState(motion ? 0 : target);
  useEffect(() => {
    if (!motion) {
      setWidth(target);
      return;
    }
    setWidth(0);
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setWidth(target)));
    return () => cancelAnimationFrame(raf);
  }, [target, motion]);
  return (
    <div style={{ position: 'relative', height: 10, borderRadius: 999, background: track }}>
      <div
        style={{
          position: 'absolute',
          inset: '0 auto 0 0',
          width: width + '%',
          borderRadius: 999,
          background: `linear-gradient(90deg, ${mix(color, 18)}, ${color})`,
          boxShadow: glow > 0 ? `0 0 ${18 * glow}px ${mix(color, 70 * glow)}` : undefined,
          transition: motion ? 'width 0.9s cubic-bezier(0.2, 0.7, 0.2, 1)' : undefined,
        }}
      >
        <i
          style={{
            position: 'absolute',
            right: -7,
            top: '50%',
            width: 14,
            height: 14,
            marginTop: -7,
            borderRadius: '50%',
            boxSizing: 'border-box',
            border: `2px solid ${ring}`,
            background: color,
            boxShadow: glow > 0 ? `0 0 ${14 * glow}px ${mix(color, 80 * glow)}` : undefined,
          }}
        />
      </div>
    </div>
  );
}

export function KpiCard({
  theme,
  variant = 'trend',
  title,
  subtitle,
  value,
  unit = '',
  digits = 0,
  compare,
  better,
  series,
  plan,
  note,
  accent = 'blue',
  period,
  glow = 0.35,
  buttonGlow = 0.6,
  pointGlow = 0.15,
  fill = 0.15,
  radius = 20,
  width = 250,
  motion = false,
  onOpen,
  onPeriodClick,
}: KpiCardProps) {
  const c = ui(theme);
  const p = paints(theme, accent);
  const shown = useCount(value, motion);
  const inner = width - 32;
  const kind = plan ? 'progress' : series?.length ? 'spark' : compare ? 'delta' : 'number';
  const share = plan ? value / plan : 0;
  const diff = compare ? value - compare.base : 0;
  const tone = !compare || !better || diff === 0 ? c.secondary : diff > 0 === (better === 'up') ? c.good : c.bad;
  const pct = compare ? signed((diff / compare.base) * 100, 1) + '%' : '';
  const diffText = compare ? `${signed(diff, digits)} ${unit} ${compare.label}` : '';
  const compact = variant === 'compact';

  const card: CSSProperties = {
    boxSizing: 'border-box',
    width,
    minHeight: compact ? 119 : 250,
    padding: compact ? '12px 16px' : 16,
    borderRadius: radius,
    background: `radial-gradient(120% 90% at 100% 100%, ${mix(p.fill, glow * 26)} 0%, transparent 62%), ${c.card}`,
    color: c.text,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: compact ? 'space-between' : undefined,
    gap: compact ? 6 : undefined,
    fontVariantNumeric: 'tabular-nums',
    overflow: 'hidden',
  };
  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: compact ? 14 : 15,
    lineHeight: compact ? '18px' : '20px',
    fontWeight: 600,
  };
  const small: CSSProperties = { margin: 0, fontSize: 13, lineHeight: '18px', color: c.secondary };
  const unitText = plan && compact ? `из ${fmt(plan, digits)} ${unit}` : unit;
  const number = (
    <div style={{ whiteSpace: 'nowrap', letterSpacing: '-0.02em', fontSize: compact ? 30 : 40, lineHeight: compact ? '34px' : '46px' }}>
      {fmt(motion ? Math.round(shown * 10 ** digits) / 10 ** digits : value, digits)}
      {unitText && (
        <span style={{ marginLeft: 5, fontSize: 14, letterSpacing: 0, color: c.secondary }}>{unitText}</span>
      )}
    </div>
  );
  const openButton = (
    <button
      type="button"
      aria-label="Подробнее"
      onClick={onOpen}
      style={
        compact
          ? { ...button, width: 28, height: 28, borderRadius: '50%', color: p.fill, background: mix(p.fill, 16) }
          : {
              ...button,
              width: 32,
              height: 32,
              borderRadius: '50%',
              color: '#fff',
              background: p.fill,
              boxShadow:
                buttonGlow > 0 ? `0 ${4 * buttonGlow}px ${20 * buttonGlow}px ${mix(p.fill, 75 * buttonGlow)}` : undefined,
            }
      }
    >
      {compact ? (
        <Arrow up diagonal />
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );

  if (compact) {
    let second: ReactNode = subtitle ?? note;
    if (kind === 'spark' && compare)
      second = (
        <>
          <span style={{ color: tone, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
            <Arrow up={diff >= 0} size={13} />
            {pct}
          </span>{' '}
          {compare.label}
        </>
      );
    else if (compare) second = diffText;
    return (
      <article style={card}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <h4 style={titleStyle}>{title}</h4>
          {openButton}
        </header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              {number}
              {compare && kind !== 'spark' && (
                <span style={{ color: tone, display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 14, lineHeight: '18px' }}>
                  <Arrow up={diff >= 0} />
                  {pct}
                </span>
              )}
            </div>
            {kind !== 'progress' && <p style={{ ...small, whiteSpace: 'nowrap' }}>{second}</p>}
          </div>
          {kind === 'spark' && series && <DotColumns series={series} color={p.fill} glow={glow} motion={motion} />}
          {kind === 'progress' && <span style={{ fontSize: 15, lineHeight: '34px', fontWeight: 500 }}>{fmt(share * 100)}%</span>}
        </div>
        {kind === 'progress' && <DotProgress share={share} color={p.fill} track={c.track} glow={glow} width={inner} />}
      </article>
    );
  }

  let foot: ReactNode = note;
  if (compare)
    foot = (
      <>
        <b style={{ color: tone, fontWeight: 500 }}>{pct}</b> {diffText}
      </>
    );
  if (plan)
    foot = (
      <>
        <b style={{ fontWeight: 500 }}>{fmt(share * 100)}% плана</b> из {fmt(plan, digits)} {unit}
      </>
    );
  return (
    <article style={card}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <h4 style={titleStyle}>{title}</h4>
        {period && (
          <button
            type="button"
            onClick={onPeriodClick}
            style={{
              ...button,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 12,
              lineHeight: '16px',
              color: c.text,
              background: c.track,
              whiteSpace: 'nowrap',
            }}
          >
            {period}
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </header>
      {subtitle && <p style={{ ...small, marginTop: 10 }}>{subtitle}</p>}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        {number}
        {compare && (
          <span style={{ color: tone, alignSelf: 'flex-start', marginTop: 6 }}>
            <Arrow up={diff >= 0} diagonal />
          </span>
        )}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
        {kind === 'spark' && series && (
          <TrendArea
            series={series}
            color={p.stroke}
            ring={c.solidCard}
            glow={glow}
            pointGlow={pointGlow}
            fill={fill}
            motion={motion}
            width={inner}
          />
        )}
        {kind === 'progress' && (
          <TrendBar share={share} color={p.fill} track={c.track} ring={c.solidCard} glow={glow} motion={motion} />
        )}
      </div>
      <footer
        style={{
          paddingTop: 8,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 12,
          fontSize: 13,
          lineHeight: '18px',
          color: c.secondary,
        }}
      >
        <span>{foot}</span>
        {openButton}
      </footer>
    </article>
  );
}
