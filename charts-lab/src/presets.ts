import type { ThemeName } from '@chart-lab/charts/theme';
import {
  defaults,
  initialSettings,
  kinds,
  type Kind,
  type Settings,
} from './catalog';

// Настройка лаборатории в виде JSON: только параметры, которые отличаются
// от начальных значений вида. Тот же формат лаборатория хранит в localStorage.

export const presetFormat = 'chart-lab/settings@1';
const storageKey = 'chart-lab:settings';

type SettingKey = Exclude<keyof Settings, 'theme'>;
export type ViewChanges = Partial<Pick<Settings, SettingKey>>;
export type ByKind = Partial<Record<Kind, Settings>>;

export interface Preset {
  format: typeof presetFormat;
  recharts: string;
  theme: ThemeName;
  views: Partial<Record<Kind, ViewChanges>>;
}

export function changesOf(kind: Kind, s: Settings): ViewChanges {
  const base = initialSettings(kind);
  const changes: Record<string, unknown> = {};
  for (const key of Object.keys(base) as (keyof Settings)[]) {
    if (key !== 'theme' && s[key] !== base[key]) changes[key] = s[key];
  }
  return changes as ViewChanges;
}

export function buildPreset(
  theme: ThemeName,
  byKind: ByKind,
  only?: Kind
): Preset {
  const views: Preset['views'] = {};
  for (const kind of only ? [only] : kinds) {
    const s = byKind[kind];
    const changes = s ? changesOf(kind, s) : {};
    if (only || Object.keys(changes).length) views[kind] = changes;
  }
  return { format: presetFormat, recharts: '3.11.0', theme, views };
}

export interface ParsedPreset {
  theme?: ThemeName;
  byKind: ByKind;
  applied: { kind: Kind; count: number }[];
  skipped: string[];
}

const isKind = (key: string): key is Kind =>
  (kinds as string[]).includes(key);
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

// Принимает полный объект настройки или только блок views.
// Неизвестные виды и параметры, а также значения другого типа пропускает.
export function parsePreset(text: string): ParsedPreset {
  const raw: unknown = JSON.parse(text);
  if (!isRecord(raw)) throw new Error('Ожидается объект JSON');
  const views = isRecord(raw.views) ? raw.views : raw;
  const result: ParsedPreset = { byKind: {}, applied: [], skipped: [] };
  if (raw.theme === 'light' || raw.theme === 'dark') result.theme = raw.theme;
  for (const [kind, changes] of Object.entries(views)) {
    if (['format', 'recharts', 'theme'].includes(kind)) continue;
    if (!isKind(kind) || !isRecord(changes)) {
      result.skipped.push(kind);
      continue;
    }
    const next: Record<string, unknown> = { ...initialSettings(kind) };
    let count = 0;
    for (const [key, value] of Object.entries(changes)) {
      const known = key in defaults && key !== 'theme';
      const base = (defaults as Record<string, unknown>)[key];
      if (known && typeof value === typeof base) {
        next[key] = value;
        count += 1;
      } else {
        result.skipped.push(kind + '.' + key);
      }
    }
    result.byKind[kind] = next as Settings;
    result.applied.push({ kind, count });
  }
  return result;
}

export function loadSaved(): { theme?: ThemeName; byKind: ByKind } {
  try {
    const text = window.localStorage.getItem(storageKey);
    if (!text) return { byKind: {} };
    const { theme, byKind } = parsePreset(text);
    return { theme, byKind };
  } catch {
    return { byKind: {} };
  }
}

export function saveSettings(theme: ThemeName, byKind: ByKind) {
  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify(buildPreset(theme, byKind))
    );
  } catch {
    // Без хранилища лаборатория работает как раньше, до перезагрузки.
  }
}
