import type { CSSProperties } from 'react';
import {
  dataPaint,
  tableTokens,
  type ThemeName,
} from '@chart-lab/charts/theme';

export const sddsSource =
  'https://www.npmjs.com/package/@sddsjs/sdds_finai/v/0.2.1';
export const tableSource =
  'https://github.com/daisforge/dais-ui/blob/838483abfd0b13707cc1a923c9eb81fb0a75f2c9/packages/ui-kit/src/components/TableGlide/theming/table-colors.generated.ts';

export const channelTokens = {
  Поиск: 'data-blue',
  Партнёры: 'data-yellow',
  Рассылки: 'data-orchid',
  Прямые: 'data-arctic',
} as const;
export type Channel = keyof typeof channelTokens;

const outlines = {
  'data-blue': 'data-blue',
  'data-yellow': 'inverse-data-yellow',
  'data-orchid': 'inverse-data-orchid',
  'data-arctic': 'inverse-data-arctic',
} as const;

export function channelPalette(theme: ThemeName, name: Channel) {
  const token = channelTokens[name];

  return {
    color: dataPaint(theme, token),
    strokeColor: dataPaint(theme, theme === 'light' ? outlines[token] : token),
  };
}

export function tableStyle(name: ThemeName): CSSProperties {
  const ui = tableTokens[name];
  const colors = {
    '--page': ui.bgRowHovered,
    '--surface': `var(--surface-solid-card, ${ui.bgCell})`,
    '--header': `var(--surface-accent-minor, ${ui.bgHeader})`,
    '--editable': `var(--data-yellow-light, ${ui.bgEditableCell})`,
    '--ink': `var(--text-primary, ${ui.textDark})`,
    '--accent': `var(--outline-accent, ${ui.accentColor})`,
    '--border': `var(--outline-solid-primary, ${ui.borderColor})`,
    '--code-background': tableTokens.dark.bgHeader,
    '--code-text': tableTokens.dark.textDark,
  };
  return { ...colors, colorScheme: name };
}
