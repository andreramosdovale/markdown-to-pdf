import { useState, useEffect, useRef, useMemo } from 'react';
import { parseMarkdown, preloadKatex } from '../lib/markdown';
import type { Settings } from './EditorApp';

interface Props {
  content: string;
  settings: Settings;
  darkMode: boolean;
}

let mermaidPromise: Promise<typeof import('mermaid').default> | null = null;

function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid').then(m => m.default);
  }
  return mermaidPromise;
}

export default function MarkdownPreview({ content, settings, darkMode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgCache = useRef(new Map<string, string>());

  const [debouncedContent, setDebouncedContent] = useState(content);
  useEffect(() => {
    const id = setTimeout(() => setDebouncedContent(content), 150);
    return () => clearTimeout(id);
  }, [content]);

  const [katexVersion, setKatexVersion] = useState(0);
  useEffect(() => {
    if (/\$/.test(debouncedContent)) {
      preloadKatex().then(() => setKatexVersion(v => v + 1));
    }
  }, [debouncedContent]);

  const html = useMemo(
    () => parseMarkdown(debouncedContent),
    [debouncedContent, katexVersion],
  );

  useEffect(() => {
    let cancelled = false;
    let localCounter = 0;

    async function renderDiagrams() {
      const container = containerRef.current;
      if (!container) return;

      const nodes = Array.from(container.querySelectorAll<HTMLElement>('pre.mermaid'));
      if (!nodes.length) return;

      const mermaid = await getMermaid();
      if (cancelled) return;

      mermaid.initialize({
        startOnLoad: false,
        theme: darkMode ? 'dark' : 'neutral',
        securityLevel: 'loose',
        fontFamily: 'Inter, system-ui, sans-serif',
      });

      for (const node of nodes) {
        const diagramText = node.textContent ?? '';
        const cached = svgCache.current.get(diagramText);

        if (cached) {
          if (!cancelled) node.innerHTML = cached;
          continue;
        }

        const id = `mermaid-${++localCounter}`;
        try {
          const { svg } = await mermaid.render(id, diagramText);
          svgCache.current.set(diagramText, svg);
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
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
