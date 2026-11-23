import { useRechartsTheme, type TooltipContentProps } from 'recharts';
import { tableTokens } from './theme.js';

export interface TooltipOptions {
  unit: string;
  compare?: [actualKey: string, planKey: string];
}
const number = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
const signed = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 2,
  signDisplay: 'exceptZero',
});

export function ChartTooltip({
  active,
  label,
  payload,
  accessibilityLayer,
  options,
  categoryKey,
  fallbackColor,
}: TooltipContentProps & {
  options?: TooltipOptions;
  categoryKey?: string;
  fallbackColor?: string;
}) {
  const theme = useRechartsTheme();
  const items = payload.filter(
    (item) => item.type !== 'none' && item.value != null && !item.hide
  );
  if (!active || !items.length) return null;
  const valueOf = (key: string) =>
    items.find((item) => item.dataKey === key)?.value;
  const actual = options?.compare && valueOf(options.compare[0]);
  const plan = options?.compare && valueOf(options.compare[1]);
  return (
    <div
      className="chart-tooltip"
      role={accessibilityLayer ? 'status' : undefined}
      aria-atomic={accessibilityLayer || undefined}
      style={{
        borderRadius: 10,
        padding: '10px 13px',
        minWidth: 130,
        maxWidth: 'min(280px, 75vw)',
        pointerEvents: 'none',
        fontSize: 14,
        lineHeight: 1.45,
        boxShadow: '0 4px 16px rgb(0 0 0 / 15%)',
        background: tableTokens.dark.bgHeader,
        color: tableTokens.dark.textDark,
        ...theme?.tooltip?.contentStyle,
      }}
    >
      {label != null && label !== '' && (
        <strong style={{ display: 'block', marginBottom: 5 }}>{label}</strong>
      )}
      {items.map((item, index) => {
        const row = item.payload;
        const color =
          (categoryKey && row?.color) ||
          fallbackColor ||
          item.color ||
          item.fill ||
          item.stroke ||
          'currentColor';
        const name = (categoryKey && row?.[categoryKey]) ?? item.name;
        const value = Array.isArray(item.value)
          ? item.value.join(' – ')
          : typeof item.value === 'number'
          ? number.format(item.value)
          : item.value;
        const unit = options?.unit || item.unit;
        return (
          <div
            key={
              item.graphicalItemId + '-' + String(item.dataKey) + '-' + index
            }
            style={{
              display: 'grid',
              gridTemplateColumns: '9px 1fr auto',
              gap: 8,
              alignItems: 'center',
              padding: '2px 0',
            }}
          >
            <span
              className="chart-tooltip-dot"
              aria-hidden="true"
              style={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                background: color,
                boxShadow: '0 0 0 1px rgb(255 255 255 / 30%)',
              }}
            />
            <span>{name ?? item.dataKey?.toString()}</span>
            <strong style={{ fontVariantNumeric: 'tabular-nums' }}>
              {value}
              {unit ? <> {unit}</> : null}
            </strong>
          </div>
        );
      })}
      {options?.compare && (
        <div
          style={{
            marginTop: 6,
            borderTop: '1px solid rgb(255 255 255 / 25%)',
            paddingTop: 5,
          }}
        >
          Отклонение от плана ·{' '}
          {typeof actual === 'number' && typeof plan === 'number'
            ? signed.format(actual - plan) + ' ' + options.unit
            : 'нет данных'}
        </div>
      )}
    </div>
  );
}
