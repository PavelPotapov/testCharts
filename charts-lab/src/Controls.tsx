import { initialSettings, type Kind, type Settings } from './catalog';
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
  const hasMarkers = ['line', 'area', 'radar', 'composed'].includes(kind);
  const cartesian = ['line', 'area', 'bar', 'scatter', 'composed'].includes(
    kind
  );
  const hasGrid = cartesian || kind === 'radar';
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
      key: 'cursorFill',
      label: 'Полоса при наведении',
      path: 'cursor.fill',
      paint: theme.cursor?.fill,
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
          onClick={() => onChange({ ...initialSettings(kind), theme: s.theme })}
        >
          Сбросить
        </button>
      </header>
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
        {['line', 'area', 'composed'].includes(kind) &&
          select('curve', 'Кривая', [
            ['monotone', 'Плавная'],
            ['linear', 'Ломаная'],
            ['step', 'Ступени по середине'],
            ['stepBefore', 'Ступени в начале'],
            ['stepAfter', 'Ступени в конце'],
            ['natural', 'Естественный сплайн'],
            ['basis', 'Сглаженный сплайн'],
            ['basisOpen', 'Открытый сплайн'],
            ['basisClosed', 'Замкнутый сплайн'],
            ['linearClosed', 'Замкнутая ломаная'],
            ['monotoneX', 'Монотонная по X'],
            ['monotoneY', 'Монотонная по Y'],
            ['bump', 'Изгиб по направлению графика'],
            ['bumpX', 'Изгиб по X'],
            ['bumpY', 'Изгиб по Y'],
          ])}
        {hasMarkers && (
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
        {['area', 'radar', 'scatter'].includes(kind) &&
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
            {range(
              'hole',
              'Внутренний радиус',
              0,
              Math.min(78, s.outerRadius - 1),
              '%'
            )}
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
              ['triangle', 'Треугольник'],
              ['star', 'Звезда'],
              ['cross', 'Крест'],
            ])}
            {range('maxArea', 'Площадь маркера', 100, 900, ' px²', 10)}
          </>
        )}
        {kind === 'treemap' &&
          range('ratio', 'Пропорция ячеек', 0.5, 4, '', 0.1)}
        {kind === 'area' && (
          <>
            {toggle('gradient', 'Градиент заливки')}
            {!s.stacked &&
              select('areaBase', 'Основание области', [
                ['zero', 'Ноль'],
                ['dataMin', 'Минимум шкалы'],
                ['dataMax', 'Максимум шкалы'],
              ])}
          </>
        )}
        {[
          'line',
          'area',
          'bar',
          'composed',
          'scatter',
          'radar',
          'radial',
          'pie',
        ].includes(kind) &&
          !emptyPie &&
          toggle('valueLabels', 'Подписи значений')}
        {kind === 'bar' && (
          <>
            {!s.stacked && range('barGap', 'Зазор внутри группы', 0, 24, ' px')}
            {!s.stacked && range('minSize', 'Минимальная длина', 0, 12, ' px')}
            {toggle('barTrack', 'Фон столбцов')}
          </>
        )}
        {kind === 'composed' &&
          range('radius', 'Скругление столбцов', 0, 16, ' px')}
        {((kind === 'pie' && !emptyPie) || kind === 'radial') && (
          <>
            {range(
              'cornerRadius',
              kind === 'pie'
                ? 'Скругление углов секторов'
                : 'Скругление концов дуги',
              0,
              32,
              ' px'
            )}
            {range(
              'outerRadius',
              'Внешний радиус',
              1 + (kind === 'pie' ? s.hole : s.innerRadius),
              100,
              '%'
            )}
          </>
        )}
        {kind === 'pie' && !emptyPie && (
          <>
            {range('sweep', 'Размах секторов', 30, 360, '°', 5)}
            {range('minAngle', 'Минимальный угол сектора', 0, 6, '°')}
            {range('centerX', 'Центр по горизонтали', 30, 70, '%')}
            {range('centerY', 'Центр по вертикали', 30, 70, '%')}
            {toggle('clockwise', 'По часовой стрелке')}
            {s.valueLabels && toggle('labelLine', 'Линии к подписям')}
          </>
        )}
        {((kind === 'pie' && !emptyPie) || kind === 'funnel') &&
          range('borderWidth', 'Толщина обводки', 0, 8, ' px')}
        {kind === 'radial' && (
          <>
            {range('startAngle', 'Начальный угол', 0, 360, '°')}
            {range(
              'innerRadius',
              'Внутренний радиус',
              0,
              s.outerRadius - 1,
              '%'
            )}
          </>
        )}
        {kind === 'radar' && (
          <>
            {range('outerRadius', 'Радиус профиля', 40, 90, '%')}
            {range('startAngle', 'Начальный угол', 0, 360, '°')}
            {range('scaleMax', 'Верхняя граница шкалы', 90, 200, '', 5)}
            {s.grid && toggle('spokes', 'Лучи сетки')}
          </>
        )}
        {kind === 'scatter' && (
          <>
            {range('minArea', 'Минимальная площадь', 4, 90, ' px²')}
            {select('connection', 'Соединение точек', [
              ['none', 'Без линии'],
              ['joint', 'По порядку записей'],
              ['fitting', 'Линия тренда'],
            ])}
          </>
        )}
        {kind === 'treemap' && (
          <>
            {range('cornerRadius', 'Скругление плиток', 0, 24, ' px')}
            {toggle('tileLabels', 'Подписи плиток')}
            {s.tileLabels &&
              range(
                'labelMinWidth',
                'Ширина плитки для подписи',
                45,
                180,
                ' px',
                5
              )}
          </>
        )}
        {kind === 'funnel' && s.funnelLabels && (
          <>
            {select('labelPosition', 'Положение подписей', [
              ['right', 'Справа'],
              ['center', 'Внутри'],
              ['left', 'Слева'],
            ])}
            {select('labelField', 'Текст подписи', [
              ['name', 'Название этапа'],
              ['value', 'Количество'],
            ])}
          </>
        )}
        {((kind === 'treemap' && s.tileLabels) ||
          (kind === 'funnel' && s.funnelLabels)) &&
          range('fontSize', 'Размер подписи', 10, 22, ' px')}
        {range('height', 'Высота графика', 220, 440, ' px', 10)}
        {!['treemap', 'pie', 'radial', 'funnel'].includes(kind) &&
          toggle('grid', 'Сетка')}
      </fieldset>
      <>
        {hasMarkers && (
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
        )}
        <fieldset>
          <legend>Легенда и подсказка</legend>
          {select('legendPosition', 'Легенда', [
            ['top', 'Сверху'],
            ['bottom', 'Снизу'],
            ['left', 'Слева'],
            ['right', 'Справа'],
            ['hidden', 'Скрыта'],
          ])}
          {toggle('tooltipEnabled', 'Показывать подсказку')}
          {s.tooltipEnabled && (
            <>
              {select('trigger', 'Открывать подсказку', [
                ['hover', 'При наведении'],
                ['click', 'По щелчку'],
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
              {s.tooltipPosition === 'follow' &&
                range('offset', 'Отступ от курсора', 0, 32, ' px')}
              {kind !== 'scatter' &&
                kind !== 'radial' &&
                select('tooltipKind', 'Содержимое подсказки', [
                  ['standard', 'Стандартная'],
                  ['formatted', 'С единицами'],
                  ...(hasSeries
                    ? [
                        ['comparison', 'С отклонением'] as [
                          'comparison',
                          string
                        ],
                      ]
                    : []),
                ])}
              {kind === 'bar' &&
                toggle('sharedTip', 'Сравнивать столбцы категории')}
            </>
          )}
        </fieldset>
      </>
      <fieldset className="line-detail-colors">
        <legend>
          {hasGrid ? 'Цвета подсказки и сетки' : 'Цвет подсказки'}
        </legend>
        <dl className="palette-list">
          {details.map(
            ({ key, label, path, paint }) =>
              (key !== 'gridStroke' || hasGrid) &&
              (key !== 'cursorStroke' ||
                ['area', 'composed', 'line', 'scatter'].includes(kind)) &&
              (key !== 'cursorFill' || kind === 'bar') &&
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
      {['line', 'area', 'bar', 'pie'].includes(kind) && (
        <fieldset>
          <legend>Данные</legend>
          {(kind === 'line' || kind === 'area') && (
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
      {cartesian && (
        <fieldset>
          <legend>Оси и сетка</legend>
          {toggle('xVisible', 'Показывать ось X')}
          {toggle('yVisible', 'Показывать ось Y')}
          {s.xVisible && (
            <>
              {select('xSide', 'Положение оси X', [
                ['bottom', 'Снизу'],
                ['top', 'Сверху'],
              ])}
              {range('xAngle', 'Наклон подписей X', -60, 60, '°', 5)}
            </>
          )}
          {s.yVisible &&
            select('ySide', 'Положение оси Y', [
              ['left', 'Слева'],
              ['right', 'Справа'],
            ])}
          {toggle('reverseX', 'Обратный порядок X')}
          {toggle('reverseY', 'Обратный порядок Y')}
          {(s.xVisible || s.yVisible) &&
            range('axisFont', 'Шрифт шкал', 9, 18, ' px')}
          {s.grid && (
            <>
              {select('gridDirection', 'Линии сетки', [
                ['auto', 'По ориентации графика'],
                ['both', 'В обоих направлениях'],
                ['horizontal', 'Горизонтальные'],
                ['vertical', 'Вертикальные'],
              ])}
              {select('gridPattern', 'Штрих сетки', [
                ['3 5', 'Пунктир'],
                ['1 3', 'Точки'],
                ['', 'Сплошной'],
              ])}
              {range('gridWidth', 'Толщина сетки', 1, 4, ' px')}
            </>
          )}
        </fieldset>
      )}
      {!emptyPie && (
        <fieldset>
          <legend>Движение</legend>
          {toggle('motion', 'Анимация')}
          {s.motion && (
            <>
              {range('delay', 'Задержка запуска', 0, 1200, ' мс', 50)}
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
