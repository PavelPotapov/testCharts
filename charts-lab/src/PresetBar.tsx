import { useEffect, useState } from 'react';
import type { ThemeName } from '@chart-lab/charts/theme';
import { catalog, type Kind } from './catalog';
import { buildPreset, parsePreset, type ByKind } from './presets';

type Props = {
  kind: Kind;
  theme: ThemeName;
  byKind: ByKind;
  onImport: (
    theme: ThemeName | undefined,
    byKind: ByKind,
    first?: Kind
  ) => void;
};

function params(n: number) {
  const last = n % 10;
  const tens = n % 100;
  const word =
    last === 1 && tens !== 11
      ? 'параметр'
      : last >= 2 && last <= 4 && (tens < 12 || tens > 14)
      ? 'параметра'
      : 'параметров';
  return n + ' ' + word;
}

const describe = (items: { kind: Kind; count: number }[]) =>
  items
    .map(({ kind, count }) => catalog[kind].label + ', ' + params(count))
    .join('; ');

export function PresetBar({ kind, theme, byKind, onImport }: Props) {
  const [message, setMessage] = useState('');
  const [manual, setManual] = useState('');
  const [pasting, setPasting] = useState(false);
  const [draft, setDraft] = useState('');
  // Текст для ручного копирования устаревает при любой правке настроек.
  useEffect(() => {
    setManual((text) => {
      if (text) setMessage('');
      return '';
    });
  }, [kind, theme, byKind]);

  async function copy(only?: Kind) {
    const preset = buildPreset(theme, byKind, only);
    const text = JSON.stringify(preset, null, 2);
    const items = Object.entries(preset.views).map(([k, changes]) => ({
      kind: k as Kind,
      count: Object.keys(changes ?? {}).length,
    }));
    const summary = items.length ? describe(items) : 'изменений нет';
    setPasting(false);
    try {
      await navigator.clipboard.writeText(text);
      setManual('');
      setMessage('Скопировано: ' + summary);
    } catch {
      setManual(text);
      setMessage('Буфер обмена недоступен, скопируйте текст ниже вручную');
    }
  }

  function apply() {
    try {
      const parsed = parsePreset(draft);
      const skipped = parsed.skipped.length
        ? '. Пропущено: ' + parsed.skipped.join(', ')
        : '';
      if (!parsed.applied.length && !parsed.theme) {
        setMessage('В тексте нет применимых настроек' + skipped);
        return;
      }
      onImport(parsed.theme, parsed.byKind, parsed.applied[0]?.kind);
      setPasting(false);
      setDraft('');
      setManual('');
      setMessage(
        'Применено: ' + (describe(parsed.applied) || 'тема') + skipped
      );
    } catch (error) {
      setMessage(
        'Не получилось прочитать JSON: ' +
          (error instanceof Error ? error.message : String(error))
      );
    }
  }

  return (
    <section className="preset-bar" aria-label="Настройка лаборатории">
      <div className="preset-actions">
        <button className="text" onClick={() => copy(kind)}>
          Скопировать настройку вида
        </button>
        <button className="text" onClick={() => copy()}>
          Скопировать все виды
        </button>
        <button
          className="text"
          aria-expanded={pasting}
          onClick={() => {
            setManual('');
            setPasting((open) => !open);
          }}
        >
          Вставить настройку
        </button>
        <span className="preset-status" role="status">
          {message}
        </span>
      </div>
      {pasting && (
        <div className="preset-paste">
          <textarea
            aria-label="JSON настройки"
            placeholder='{"views": {"line": {"width": 2}}}'
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="preset-paste-actions">
            <button className="replay" disabled={!draft.trim()} onClick={apply}>
              Применить
            </button>
            <button
              className="text"
              onClick={() => {
                setPasting(false);
                setDraft('');
              }}
            >
              Отмена
            </button>
          </div>
        </div>
      )}
      {manual && (
        <textarea
          className="preset-manual"
          aria-label="JSON настройки для копирования"
          readOnly
          value={manual}
          onFocus={(e) => e.target.select()}
        />
      )}
    </section>
  );
}
