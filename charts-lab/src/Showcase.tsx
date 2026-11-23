import { Suspense, useEffect, useRef, useState } from 'react';
import { catalog, defaults, kinds, type Kind, type Settings } from './catalog';
import { ChartLegend } from './ChartLegend';

function Preview({ kind, settings }: { kind: Kind; settings: Settings }) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!container.current || typeof IntersectionObserver === 'undefined') {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: '160px' }
    );
    observer.observe(container.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className="preview-canvas"
      ref={container}
      style={{ height: settings.height }}
    >
      {ready && (
        <Suspense fallback={<span role="status">Загрузка графика…</span>}>
          {catalog[kind].render(settings)}
        </Suspense>
      )}
    </div>
  );
}

export function Showcase({
  theme,
  openLab,
}: {
  theme: Settings['theme'];
  openLab: (kind: Kind) => void;
}) {
  const settings = { ...defaults, theme, height: 218 };
  return (
    <section className="showcase" aria-label="Все виды графиков">
      {kinds.map((kind) => {
        const item = catalog[kind];
        return (
          <article
            key={kind}
            className="panel showcase-card"
            aria-labelledby={'preview-' + kind}
          >
            <header>
              <div>
                <h2 id={'preview-' + kind}>{item.label}</h2>
                <p>{item.note}</p>
              </div>
              <button
                className="replay"
                onClick={() => openLab(kind)}
                aria-label={'Настроить график «' + item.label + '»'}
              >
                Настроить
              </button>
            </header>
            <Preview kind={kind} settings={settings} />
            <ChartLegend kind={kind} settings={settings} />
          </article>
        );
      })}
    </section>
  );
}
