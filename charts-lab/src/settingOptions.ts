import type { Settings } from './catalog';

export const settingOptions = {
  curve: [
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
  ],
  dash: [
    ['6 4', 'Пунктир'],
    ['2 4', 'Короткий'],
    ['', 'Сплошной'],
  ],
  tip: [
    ['rectangle', 'Прямоугольник'],
    ['triangle', 'Треугольник'],
  ],
  gridType: [
    ['polygon', 'Многоугольник'],
    ['circle', 'Круг'],
  ],
  shape: [
    ['circle', 'Круг'],
    ['diamond', 'Ромб'],
    ['square', 'Квадрат'],
    ['triangle', 'Треугольник'],
    ['star', 'Звезда'],
    ['cross', 'Крест'],
  ],
  areaBase: [
    ['zero', 'Ноль'],
    ['dataMin', 'Минимум шкалы'],
    ['dataMax', 'Максимум шкалы'],
  ],
  connection: [
    ['none', 'Без линии'],
    ['joint', 'По порядку записей'],
    ['fitting', 'Линия тренда'],
  ],
  labelPosition: [
    ['right', 'Справа'],
    ['center', 'Внутри'],
    ['left', 'Слева'],
  ],
  labelField: [
    ['name', 'Название этапа'],
    ['value', 'Количество'],
  ],
  dotShape: [
    ['circle', 'Круг'],
    ['diamond', 'Ромб'],
    ['square', 'Квадрат'],
    ['triangle', 'Треугольник'],
  ],
  activeDotAppearance: [
    ['none', 'Мгновенно'],
    ['grow', 'Увеличение'],
    ['fade', 'Проявление'],
    ['pulse', 'Пульс'],
  ],
  legendPosition: [
    ['top', 'Сверху'],
    ['bottom', 'Снизу'],
    ['left', 'Слева'],
    ['right', 'Справа'],
    ['hidden', 'Скрыта'],
  ],
  trigger: [
    ['hover', 'При наведении'],
    ['click', 'По щелчку'],
  ],
  tooltipPosition: [
    ['follow', 'У курсора'],
    ['top-left', 'Сверху слева'],
    ['top-right', 'Сверху справа'],
    ['bottom-left', 'Снизу слева'],
    ['bottom-right', 'Снизу справа'],
  ],
  tooltipAppearance: [
    ['none', 'Мгновенно'],
    ['fade', 'Проявление'],
    ['rise', 'Сдвиг снизу'],
  ],
  period: [
    ['initial', 'Январь — декабрь'],
    ['shifted', 'Февраль — январь'],
  ],
  xSide: [
    ['bottom', 'Снизу'],
    ['top', 'Сверху'],
  ],
  ySide: [
    ['left', 'Слева'],
    ['right', 'Справа'],
  ],
  gridDirection: [
    ['auto', 'По ориентации графика'],
    ['both', 'В обоих направлениях'],
    ['horizontal', 'Горизонтальные'],
    ['vertical', 'Вертикальные'],
  ],
  gridPattern: [
    ['3 5', 'Пунктир'],
    ['1 3', 'Точки'],
    ['', 'Сплошной'],
  ],
  easing: [
    ['ease-out', 'С замедлением'],
    ['ease-in-out', 'Плавный'],
    ['linear', 'Линейный'],
  ],
  tooltipKind: [
    ['standard', 'Стандартная'],
    ['formatted', 'С единицами'],
    ['comparison', 'С отклонением'],
  ],
} satisfies Partial<{ [K in keyof Settings]: [Settings[K], string][] }>;
