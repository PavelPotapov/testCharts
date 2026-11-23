import { useState } from 'react';
import index from './recharts-api.json';
import { apiComponents } from './apiComponents';
import type { Kind } from './catalog';

export function ApiReference({ kind }: { kind: Kind }) {
  const [query, setQuery] = useState('');
  const [all, setAll] = useState(false);
  const search = query.trim().toLowerCase();
  const matches = apiComponents(kind)
    .map((name) => {
      const item = index.components[name as keyof typeof index.components];
      const fields = (
        item.props + (all ? ' ' + index.platform[item.platform] : '')
      )
        .trim()
        .split(/\s+/)
        .filter(
          (p) =>
            p &&
            (name.toLowerCase().includes(search) ||
              p.toLowerCase().includes(search))
        );
      return { name, fields };
    })
    .filter((row) => row.fields.length);
  return (
    <details className="guide-detail api-reference">
      <summary>Свойства компонентов Recharts 3.11.0</summary>
      <p>
        Поиск охватывает типы из установленного пакета. Выберите компонент,
        чтобы посмотреть имена свойств и открыть их описание. Числа, строки,
        логические значения и объекты можно пробовать в редакторе Recharts.
        Обработчики событий, функции форматирования и собственные
        React-компоненты передаются из кода приложения.
      </p>
      <label>
        Найти свойство или компонент{' '}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Например, cornerRadius"
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={all}
          onChange={(e) => setAll(e.target.checked)}
        />{' '}
        Включить события и атрибуты платформы
      </label>
      {matches.length === 0 && <p role="status">Совпадений нет.</p>}
      {matches.map(({ name, fields }) => (
        <details key={name} open={search ? true : undefined}>
          <summary>
            {name} · {fields.length}
          </summary>
          <p>
            <code>{fields.join(' · ')}</code>
          </p>
          <a href={'https://recharts.github.io/en-US/api/' + name + '/'}>
            Документация {name}
          </a>
        </details>
      ))}
    </details>
  );
}
