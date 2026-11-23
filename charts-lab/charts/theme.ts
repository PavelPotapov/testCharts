import type { RechartsTheme } from 'recharts';

export type ThemeName = 'light' | 'dark';

// @sddsjs/sdds_finai 0.2.1, css/sdds_finai_default__{light,dark}.css

export const dataTokens = {
  light: {
    'data-blue': '#199AF0',
    'data-yellow': '#F3A912',
    'inverse-data-yellow': '#A16B00',
    'data-orchid': '#C46BFF',
    'inverse-data-orchid': '#A139E5',
    'data-arctic': '#00AC7B',
    'inverse-data-arctic': '#197D61',
    'data-gray': '#8A959D',
  },
  dark: {
    'data-blue': '#0B7ECB',
    'data-yellow': '#A16B00',
    'inverse-data-yellow': '#F3A912',
    'data-orchid': '#A139E5',
    'inverse-data-orchid': '#C46BFF',
    'data-arctic': '#197D61',
    'inverse-data-arctic': '#00AC7B',
    'data-gray': '#707C84',
  },
};

// Ключи и значения из TABLE_STATE_COLORS, темы light и dark.

export const tableTokens = {
  light: {
    bgCell: '#FFFFFF',
    bgRowHovered: '#F5F7F9',
    bgHeader: '#ECF6FC',
    bgEditableCell: '#FFF6E5',
    textDark: '#13181BF5',
    borderColor: '#D5DFE6',
    accentColor: '#0B7ECB',
  },
  dark: {
    bgCell: '#060A0C',
    bgRowHovered: '#0C1013',
    bgHeader: '#071A26',
    bgEditableCell: '#211807',
    textDark: '#F2F5F8F5',
    borderColor: '#23292D',
    accentColor: '#199AF0',
  },
};

export function dataPaint(
  theme: ThemeName,
  key: keyof typeof dataTokens.light
) {
  return `var(--${key}, ${dataTokens[theme][key]})`;
}

export function chartColors(theme: ThemeName, cssVariables = false) {
  const color = (key: keyof typeof dataTokens.light) =>
    cssVariables ? dataPaint(theme, key) : dataTokens[theme][key];
  const planLineToken =
    theme === 'light' ? 'inverse-data-yellow' : 'data-yellow';
  return {
    actual: color('data-blue'),
    plan: color('data-yellow'),
    planStroke: color(planLineToken),
    planLineToken,
    custom: color(theme === 'light' ? 'inverse-data-orchid' : 'data-orchid'),
  };
}

function createTheme(name: ThemeName): RechartsTheme {
  const ui = tableTokens[name];
  const colors = chartColors(name, true);
  return {
    graphicalItems: [
      { stroke: colors.actual, fill: colors.actual },
      { stroke: colors.planStroke, fill: colors.plan },
    ],
    chart: {
      backgroundColor: `var(--surface-solid-card, ${ui.bgCell})`,
      borderRadius: 8,
    },
    typography: { color: `var(--text-primary, ${ui.textDark})` },
    axis: { stroke: `var(--text-primary, ${ui.textDark})` },
    grid: { stroke: dataPaint(name, 'data-gray') },
    cursor: {
      stroke: `var(--outline-accent, ${ui.accentColor})`,
      fill: `var(--surface-accent-minor, ${ui.bgHeader})`,
    },
    reference: { stroke: dataPaint(name, 'data-gray') },
    legend: { labelStyle: { color: `var(--text-primary, ${ui.textDark})` } },
    tooltip: {
      contentStyle: {
        background: `var(--on-dark-surface-accent-minor, ${tableTokens.dark.bgHeader})`,
        border: '1px solid ' + dataTokens.dark['data-gray'],
        borderRadius: 10,
        color: `var(--on-dark-text-primary, ${tableTokens.dark.textDark})`,
        fontSize: 14,
      },
    },
  };
}

export const chartThemes = {
  light: createTheme('light'),
  dark: createTheme('dark'),
};
