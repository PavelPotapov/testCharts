import { defaults, type Kind, type Settings } from './catalog';
import { chartPalette } from './chartPalette';
import { PaintRow } from './PaintRow';
import { chartThemes } from '@chart-lab/charts/theme';
import { sddsSource, tableSource } from './palette';

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
  const palette = chartPalette(kind, s);
  const theme = chartThemes[s.theme];
  const details = [
    {
      key: 'tooltipBackground',
      label: 'Фон карточки подсказки',
      path: 'tooltip.contentStyle.background',
      paint: theme.tooltip?.contentStyle?.background,
    },
    {
      key: 'cursorStroke',
      label: 'Пунктир при наведении',
      path: 'cursor.stroke',
      paint: theme.cursor?.stroke,
    },
    {
      key: 'gridStroke',
      label: 'Линии сетки',
      path: 'grid.stroke',
      paint: theme.grid?.stroke,
    },
  ] as const;
  const hasSeries = ['line', 'area', 'bar', 'radar', 'composed'].includes(kind);
  const emptyPie = kind === 'pie' && s.pieEmpty;
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
      {kind === 'line' && (
        <fieldset className="line-detail-colors">
          <legend>Цвета подсказки и сетки</legend>
          <dl className="palette-list">
            {details.map(
              ({ key, label, path, paint }) =>
                typeof paint === 'string' && (
                  <div key={key}>
                    <dt>{label}</dt>
                    <dd>
                      <PaintRow
                        theme={s.theme}
                        paint={s[key] || paint}
                        label={label}
                        onChange={(value) => set(key, value)}
                      />
                      <code className="paint-path">chartTheme.{path}</code>
                      {s[key] && (
                        <button
                          type="button"
                          className="text"
                          onClick={() => set(key, '')}
                          aria-label={'Вернуть токен · ' + label}
                        >
                          Вернуть токен
                        </button>
                      )}
                    </dd>
                  </div>
                )
            )}
          </dl>
        </fieldset>
      )}
      {hasSeries && (
        <fieldset>
          <legend>Видимые серии</legend>
          <div className="series-filters">
            {(['actual', 'plan'] as const).map((key) => {
              const actual = key === 'actual';
              const checked = actual ? s.showActual : s.showPlan;
              const other = actual ? s.showPlan : s.showActual;
              const swatch = palette[actual ? 0 : 1].paint;
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
        {kind === 'line' && toggle('lineOverride', 'Свой цвет «Факт»')}
        <dl className="palette-list">
          {palette.map(({ label, paint, outline, edit }) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>
                <PaintRow
                  paint={paint}
                  label={label}
                  theme={s.theme}
                  onChange={edit ? (value) => set(edit, value) : undefined}
                />
              </dd>
              {outline && outline !== paint && (
                <>
                  <dt className="paint-outline">Контур · {label}</dt>
                  <dd>
                    <PaintRow paint={outline} label={label} theme={s.theme} />
                  </dd>
                </>
              )}
            </div>
          ))}
        </dl>
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
