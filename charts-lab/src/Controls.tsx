import { defaults, type Kind, type Settings } from './catalog';

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
  const color = (key: 'color' | 'secondary' | 'lineColor', label: string) => (
    <label className="color">
      {label}
      <span>
        <input
          type="color"
          value={s[key]}
          onChange={(e) => set(key, e.target.value)}
        />
        <code>{s[key].toUpperCase()}</code>
      </span>
    </label>
  );
  const two = !['scatter', 'treemap'].includes(kind);
  const emptyPie = kind === 'pie' && s.pieEmpty;
  return (
    <aside className="panel controls">
      <header>
        <h2>Параметры</h2>
        <button className="text" onClick={() => onChange({ ...defaults })}>
          Сбросить
        </button>
      </header>
      {!emptyPie && (
        <fieldset>
          <legend>Палитра</legend>
          {kind === 'line' ? (
            <>
              {select('lineTheme', 'Тема контейнера', [
                ['light', 'Светлая'],
                ['dark', 'Тёмная'],
              ])}
              {toggle('lineOverride', 'Свой цвет «Факт»')}
              {s.lineOverride && color('lineColor', 'Цвет «Факт»')}
              <p className="control-note">
                Демонстрационная палитра <code>RechartsThemeProvider</code>.
                Цвет серии задаётся через <code>stroke</code>.
              </p>
            </>
          ) : (
            <>
              {color('color', two ? 'Первый цвет' : 'Цвет серии')}
              {two && color('secondary', 'Второй цвет')}
            </>
          )}
        </fieldset>
      )}
      {kind === 'line' && (
        <fieldset>
          <legend>Легенда и подсказка</legend>
          {select('legendPosition', 'Легенда', [
            ['top', 'Сверху'],
            ['bottom', 'Снизу'],
          ])}
          {select('tooltipKind', 'Подсказка', [
            ['standard', 'Стандартная'],
            ['formatted', 'С единицами'],
            ['comparison', 'С отклонением'],
          ])}
          <p className="control-note">
            Положение задаёт <code>verticalAlign</code>. <code>formatter</code>{' '}
            добавляет единицы, <code>content</code> выводит отклонение от плана.
          </p>
        </fieldset>
      )}
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
        {['line', 'area', 'radar', 'treemap'].includes(kind) &&
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
        {kind === 'line' && toggle('dots', 'Маркеры точек')}
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
        {!['treemap', 'pie'].includes(kind) && toggle('grid', 'Сетка')}
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
