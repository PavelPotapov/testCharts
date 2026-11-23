import { build } from 'vite';
import { gzipSync } from 'node:zlib';
import { readFileSync, writeFileSync } from 'node:fs';

const manifest = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url))
);
const kinds = Object.keys(manifest.exports).map((path) => path.slice(2));
const results = [];
for (const mode of ['react', ...kinds, 'all']) {
  const selected = mode === 'react' ? [] : mode === 'all' ? kinds : [mode];
  const imports = selected
    .map((key, i) => `import * as C${i} from '@chart-lab/charts/${key}';`)
    .join('\n');
  const components = selected.map(
    (key, i) => `C${i}.${key[0].toUpperCase() + key.slice(1)}Chart`
  );
  const entry = `${imports}
    import { createRoot } from 'react-dom/client';
    import { createElement } from 'react';
    const charts = [${components.join(',')}];
    const component = charts[window.exampleIndex] || 'div';
    createRoot(document.body).render(createElement(component, window.exampleProps));`;
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    plugins: [
      {
        name: 'consumer',
        resolveId: (id) => (id === 'consumer' ? '\0consumer' : null),
        load: (id) => (id === '\0consumer' ? entry : null),
      },
    ],
    build: { write: false, rollupOptions: { input: 'consumer' } },
  });
  const chunks = result.output.filter((o) => o.type === 'chunk');
  const modules = chunks.flatMap((chunk) =>
    Object.entries(chunk.modules)
      .filter(([, m]) => m.renderedLength > 0)
      .map(([id]) => id.replaceAll('\\', '/'))
  );
  const wrappers = kinds.filter((kind) =>
    modules.some((id) => id.endsWith('/lib/' + kind + '.js'))
  );
  if (wrappers.join() !== selected.join())
    throw new Error(`Unexpected wrappers for ${mode}: ${wrappers}`);
  const engines = [
    ...new Set(
      modules
        .map((id) => id.match(/\/recharts\/es6\/chart\/([^/]+)\.js$/)?.[1])
        .filter(Boolean)
    ),
  ].sort();
  results.push({
    mode,
    bytes: chunks.reduce((n, c) => n + Buffer.byteLength(c.code), 0),
    gzip: chunks.reduce((n, c) => n + gzipSync(c.code).length, 0),
    wrappers,
    engines,
  });
}
writeFileSync(
  new URL('../src/sizes.json', import.meta.url),
  JSON.stringify(results, null, 2) + '\n'
);
console.table(
  results.map(({ mode, bytes, gzip, wrappers }) => ({
    mode,
    bytes,
    gzip,
    adapters: wrappers.length,
  }))
);
