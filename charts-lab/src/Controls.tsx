import { defaults, stages, type Kind, type Settings } from './catalog';
import { chartColors, dataTokens } from '@chart-lab/charts/theme';
import { channelTokens, sddsSource, tableSource } from './palette';

type Props = {
  kind: Kind;
  settings: Settings;
  onChange: (s: Settings) => void;
};
type Keys<T> = {
  [K in keyof Settings]: Settings[K] extends T ? K : never;
}[keyof Settings];

export function Controls({ kind, settings: s, onChange }: Props) {
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    onChange({ ...s, [key]: value });
  const range = (
    key: Keys<number>,
    label: string,
    min: number,
    max: number,
    unit = '',
    step = 1
  ) => (
    <label className="range" htmlFor={'range-' + key}>
      <span>
        {label}
        <output htmlFor={'range-' + key}>
          {s[key]}
          {unit}
        </output>
      </span>
      <input
        id={'range-' + key}
        type="range"
        min={min}
        max={max}
        step={step}
        value={s[key]}
        onChange={(e) => set(key, Number(e.target.value))}
      />
    </label>
  );
  const toggle = (key: Keys<boolean>, label: string) => (
    <label className="toggle">
      {label}
      <input
        type="checkbox"
        checked={s[key]}
        onChange={(e) => set(key, e.target.checked)}
      />
    </label>
  );
  const select = <K extends Keys<string>>(
    key: K,
    label: string,
    options: [Settings[K], string][]
  ) => (
    <div className="choice">
      <label htmlFor={'choice-' + key}>{label}</label>
      <select
        id={'choice-' + key}
        value={s[key]}
        onChange={(e) => set(key, e.target.value as Settings[K])}
      >
        {options.map(([v, name]) => (
          <option key={v} value={v}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
  const color = (
    key: 'color' | 'secondary' | 'lineColor',
    label: string,
    fallback: string
  ) => (
    <label className="color">
      {label}
      <span>
        <input
          type="color"
          aria-label={label}
          value={(s[key] || fallback).toLowerCase()}
          onChange={(e) => set(key, e.target.value)}
        />
        <code>{(s[key] || fallback).toUpperCase()}</code>
      </span>
    </label>
  );
  const colors = chartColors(s.theme);
  const categories = ['pie', 'treemap', 'radial', 'funnel'].includes(kind);
  const hasSeries = ['line', 'area', 'bar', 'radar', 'composed'].includes(kind);
  const categoryNames = kind === 'funnel' ? stages : Object.keys(channelTokens);
  const emptyPie = kind === 'pie' && s.pieEmpty;
  type Token = keyof typeof dataTokens.light;
  const tokens: [string, Token][] = categories
    ? Object.values(channelTokens).map((token, i) => [categoryNames[i], token])
    : [
        [kind === 'scatter' ? 'Точки' : 'Факт', 'data-blue'],
        ...(kind === 'scatter'
          ? []
          : [
              [
                'План',
                kind === 'line' ? colors.planLineToken : 'data-yellow',
              ] as [string, Token],
            ]),
      ];
  return (
    <aside className="panel controls">
      <header>
        <h2>Параметры</h2>
        <button
          className="text"
          onClick={() => onChange({ ...defaults, theme: s.theme })}
        >
          Сбросить
        </button>
      </header>
      {kind === 'line' && (
        <>
          <fieldset>
            <legend>Точки и наведение</legend>
            {select('dotShape', 'Форма точки', [
              ['circle', 'Круг'],
              ['diamond', 'Ромб'],
              ['square', 'Квадрат'],
              ['triangle', 'Треугольник'],
            ])}
            {select('activeDotAppearance', 'Появление точки', [
              ['none', 'Мгновенно'],
              ['grow', 'Увеличение'],
              ['fade', 'Проявление'],
              ['pulse', 'Пульс'],
            ])}
            {s.motion &&
              s.activeRadius > 0 &&
              s.activeDotAppearance !== 'none' &&
              range(
                'activeDotDuration',
                'Длительность эффекта точки',
                100,
                1000,
                ' мс',
                50
              )}
            {range('activeRadius', 'Радиус при наведении', 0, 12, ' px')}
            {toggle('dots', 'Маркеры точек')}
            {s.dots && (
              <>
                {range('dotRadius', 'Радиус точки', 1, 8, ' px')}
                {toggle('hollowDots', 'Полые точки')}
              </>
            )}
          </fieldset>
          <fieldset>
            <legend>Легенда и подсказка</legend>
            {select('legendPosition', 'Легенда', [
              ['top', 'Сверху'],
              ['bottom', 'Снизу'],
              ['left', 'Слева'],
              ['right', 'Справа'],
              ['hidden', 'Скрыта'],
            ])}
            {select('tooltipPosition', 'Положение подсказки', [
              ['follow', 'У курсора'],
              ['top-left', 'Сверху слева'],
              ['top-right', 'Сверху справа'],
              ['bottom-left', 'Снизу слева'],
              ['bottom-right', 'Снизу справа'],
            ])}
            {select('tooltipAppearance', 'Появление подсказки', [
              ['none', 'Мгновенно'],
              ['fade', 'Проявление'],
              ['rise', 'Сдвиг снизу'],
            ])}
            {s.tooltipPosition === 'follow' &&
              toggle('tooltipSmooth', 'Плавное движение за курсором')}
            {s.motion &&
              (s.tooltipAppearance !== 'none' ||
                (s.tooltipPosition === 'follow' && s.tooltipSmooth)) &&
              range(
                'tooltipDuration',
                'Длительность эффекта подсказки',
                100,
                1000,
                ' мс',
                50
              )}
            {select('tooltipKind', 'Содержимое подсказки', [
              ['standard', 'Стандартная'],
              ['formatted', 'С единицами'],
              ['comparison', 'С отклонением'],
            ])}
            <p className="control-note">
              Наведите на месяц или используйте стрелки ← и →, когда график в
              фокусе. Для повторного появления подсказки выведите курсор за
              график и верните его.
            </p>
          </fieldset>
        </>
      )}
      {hasSeries && (
        <fieldset>
          <legend>Видимые серии</legend>
          <div className="series-filters">
            {(['actual', 'plan'] as const).map((key) => {
              const actual = key === 'actual';
              const checked = actual ? s.showActual : s.showPlan;
              const other = actual ? s.showPlan : s.showActual;
              const swatch = actual
                ? kind === 'line'
                  ? s.lineOverride
                    ? s.lineColor || colors.custom
                    : colors.actual
                  : s.color || colors.actual
                : kind === 'line'
                ? colors.planStroke
                : s.secondary || colors.plan;
              return (
                <label key={key}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={checked && !other}
                    onChange={(e) =>
                      set(actual ? 'showActual' : 'showPlan', e.target.checked)
                    }
                  />
                  <i style={{ background: swatch }} aria-hidden="true" />
                  {actual ? 'Факт' : 'План'}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
      <fieldset>
        <legend>Палитра SDDS</legend>
        {!emptyPie && (
          <details className="token-reference">
            <summary>Токены и цвета</summary>
            <dl className="palette-tokens">
              {tokens.map(([label, token]) => {
                const override =
                  kind === 'line'
                    ? label === 'Факт' &&
                      s.lineOverride &&
                      (s.lineColor || colors.custom)
                    : label === 'Факт' ||
                      label === categoryNames[0] ||
                      label === 'Точки'
                    ? s.color
                    : label === 'План' || label === categoryNames[1]
                    ? s.secondary
                    : undefined;
                const value = (
                  override || dataTokens[s.theme][token]
                ).toUpperCase();
                return (
                  <div key={token}>
                    <dt>
                      <i
                        style={{ backgroundColor: value }}
                        aria-hidden="true"
                      />
                      {label}
                    </dt>
                    <dd>
                      <code>
                        {override ? 'Свой цвет' : token} {value}
                      </code>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </details>
        )}
        {kind === 'line' && (
          <>
            {toggle('lineOverride', 'Свой цвет «Факт»')}
            {s.lineOverride && color('lineColor', 'Цвет «Факт»', colors.custom)}
            <p className="control-note">
              Свойство <code>stroke</code> переопределяет цвет из{' '}
              <code>RechartsThemeProvider</code>.
            </p>
          </>
        )}
        {kind !== 'line' && !emptyPie && (
          <>
            {color(
              'color',
              categories
                ? 'Цвет «' + categoryNames[0] + '»'
                : kind === 'scatter'
                ? 'Цвет серии'
                : 'Цвет «Факт»',
              colors.actual
            )}
            {kind !== 'scatter' &&
              color(
                'secondary',
                categories ? 'Цвет «' + categoryNames[1] + '»' : 'Цвет «План»',
                colors.plan
              )}
          </>
        )}
        <p className="control-note palette-sources">
          <a href={sddsSource}>Токены SDDS 0.2.1</a>
          <a href={tableSource}>Цвета таблицы</a>
        </p>
      </fieldset>
      {['line', 'bar', 'pie'].includes(kind) && (
        <fieldset>
          <legend>Данные</legend>
          {kind === 'line' && (
            <>
              {select('period', 'Период', [
                ['initial', 'Январь — декабрь'],
                ['shifted', 'Февраль — январь'],
              ])}
              {toggle('lineMissing', 'Пропуск в июне')}
              {s.lineMissing &&
                toggle('connectNulls', 'Соединить через пропуск')}
            </>
          )}
          {kind === 'bar' && toggle('barMixed', 'Смешанные знаки')}
          {kind === 'pie' && toggle('pieEmpty', 'Все доли равны нулю')}
        </fieldset>
      )}
      <fieldset>
        <legend>Геометрия</legend>
        {['line', 'area', 'radar', 'treemap', 'composed'].includes(kind) &&
          range(
            'width',
            kind === 'treemap' ? 'Граница ячейки' : 'Толщина линии',
            1,
            8,
            ' px'
          )}
        {['line', 'area'].includes(kind) &&
          select('curve', 'Кривая', [
            ['monotone', 'Плавная'],
            ['linear', 'Ломаная'],
            ['step', 'Ступени'],
          ])}
        {kind === 'line' && (
          <>
            {select('dash', 'Штрих «План»', [
              ['6 4', 'Пунктир'],
              ['2 4', 'Короткий'],
              ['', 'Сплошной'],
            ])}
          </>
        )}
        {kind === 'composed' &&
          range('barSize', 'Ширина столбца', 4, 32, ' px')}
        {kind === 'radial' && (
          <>
            {range('sweep', 'Размах дуги', 90, 360, '°', 15)}
            {range('barSize', 'Толщина полосы', 4, 24, ' px')}
            {toggle('track', 'Дорожка цели')}
          </>
        )}
        {kind === 'funnel' && (
          <>
            {toggle('funnelLabels', 'Подписи этапов')}
            {toggle('reversed', 'Развернуть воронку')}
            {select('tip', 'Последний этап', [
              ['rectangle', 'Прямоугольник'],
              ['triangle', 'Треугольник'],
            ])}
          </>
        )}
        {['area', 'radar'].includes(kind) &&
          range('opacity', 'Плотность заливки', 0, 1, '', 0.05)}
        {['bar', 'area'].includes(kind) && toggle('stacked', 'Накопление')}
        {kind === 'bar' && (
          <>
            {range('barSize', 'Ширина столбца', 4, 32, ' px')}
            {range('radius', 'Скругление', 0, 12, ' px')}
            {toggle('horizontal', 'Горизонтально')}
          </>
        )}
        {kind === 'pie' && !emptyPie && (
          <>
            {range('hole', 'Внутренний радиус', 0, 78, '%')}
            {range('gap', 'Зазор', 0, 14, '°')}
            {range('startAngle', 'Угол поворота', 0, 360, '°')}
          </>
        )}
        {kind === 'radar' &&
          select('gridType', 'Форма сетки', [
            ['polygon', 'Многоугольник'],
            ['circle', 'Круг'],
          ])}
        {kind === 'scatter' && (
          <>
            {select('shape', 'Маркер', [
              ['circle', 'Круг'],
              ['diamond', 'Ромб'],
              ['square', 'Квадрат'],
            ])}
            {range('maxArea', 'Площадь маркера', 100, 900, ' px²', 10)}
          </>
        )}
        {kind === 'treemap' &&
          range('ratio', 'Пропорция ячеек', 0.5, 4, '', 0.1)}
        {range('height', 'Высота графика', 220, 440, ' px', 10)}
        {!['treemap', 'pie', 'radial', 'funnel'].includes(kind) &&
          toggle('grid', 'Сетка')}
      </fieldset>
      {!emptyPie && (
        <fieldset>
          <legend>Движение</legend>
          {toggle('motion', 'Анимация')}
          {s.motion && (
            <>
              {range('duration', 'Длительность', 150, 1800, ' мс', 50)}
              {select('easing', 'Переход', [
                ['ease-out', 'С замедлением'],
                ['ease-in-out', 'Плавный'],
                ['linear', 'Линейный'],
              ])}
              {kind === 'line' && (
                <p className="control-note">
                  При сдвиге периода точки сопоставляются по <code>id</code>.
                  Учитывается системная настройка сокращения движения.
                </p>
              )}
            </>
          )}
        </fieldset>
      )}
    </aside>
  );
}
