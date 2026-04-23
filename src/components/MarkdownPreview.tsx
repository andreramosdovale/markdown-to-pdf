import { useEffect, useRef, useMemo } from 'react';
import { parseMarkdown } from '../lib/markdown';
import type { Settings } from './EditorApp';

interface Props {
  content: string;
  settings: Settings;
  darkMode: boolean;
}

async function getMermaid(dark: boolean) {
  const mermaid = (await import('mermaid')).default;
  mermaid.initialize({
    startOnLoad: false,
    theme: dark ? 'dark' : 'neutral',
    securityLevel: 'loose',
    fontFamily: 'Inter, system-ui, sans-serif',
  });
  return mermaid;
}

let diagramCounter = 0;

export default function MarkdownPreview({ content, settings, darkMode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const html = useMemo(() => parseMarkdown(content), [content]);

  useEffect(() => {
    let cancelled = false;

    async function renderDiagrams() {
      const container = containerRef.current;
      if (!container) return;

      const nodes = Array.from(container.querySelectorAll<HTMLElement>('pre.mermaid'));
      if (!nodes.length) return;

      const mermaid = await getMermaid(darkMode);
      if (cancelled) return;

      mermaid.initialize({
        startOnLoad: false,
        theme: darkMode ? 'dark' : 'neutral',
        securityLevel: 'loose',
        fontFamily: 'Inter, system-ui, sans-serif',
      });

      for (const node of nodes) {
        const diagramText = node.textContent ?? '';
        const id = `mermaid-${++diagramCounter}`;
        try {
          const { svg } = await mermaid.render(id, diagramText);
          if (!cancelled) node.innerHTML = svg;
        } catch (err) {
          if (!cancelled) {
            node.innerHTML = `<div class="mermaid-error">Diagram error: ${(err as Error).message}</div>`;
          }
        }
      }
    }

    renderDiagrams();
    return () => { cancelled = true; };
  }, [html, darkMode]);

  return (
    <div
      id="preview-content"
      ref={containerRef}
      className="prose dark:prose-invert max-w-none px-12 py-10"
      style={{
        fontFamily: settings.fontFamily,
        fontSize: `${settings.fontSize}pt`,
        lineHeight: settings.lineHeight,
      }}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
