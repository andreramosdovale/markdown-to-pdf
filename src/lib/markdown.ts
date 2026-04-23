import { marked } from 'marked';
import markedKatex from 'marked-katex-extension';
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';

marked.use(markedKatex({ throwOnError: false }));

marked.use({
  renderer: {
    code({ text, lang }) {
      if (lang === 'mermaid') {
        // Passed as-is to the DOM; mermaid.render() processes it in useEffect
        return `<pre class="mermaid not-prose">${text}</pre>`;
      }

      let highlighted = text;
      const validLang = lang && hljs.getLanguage(lang) ? lang : null;
      try {
        highlighted = validLang
          ? hljs.highlight(text, { language: validLang }).value
          : hljs.highlightAuto(text).value;
      } catch {
        highlighted = text;
      }

      const label = validLang
        ? `<span class="code-lang">${validLang}</span>`
        : '';

      return `<div class="code-wrapper not-prose">${label}<pre><code class="hljs">${highlighted}</code></pre></div>`;
    },
  },
});

const ALLOWED_TAGS = [
  'h1','h2','h3','h4','h5','h6',
  'p','br','hr','blockquote',
  'ul','ol','li',
  'strong','em','del','s','code','pre',
  'table','thead','tbody','tfoot','tr','th','td',
  'a','img',
  'mark','kbd','sub','sup',
  'div','span',
  'input',
  // SVG (for mermaid)
  'svg','g','path','rect','circle','ellipse','line','polyline','polygon',
  'text','tspan','defs','marker','use','foreignObject',
];

const ALLOWED_ATTR = [
  'href','src','alt','title','class','id','style',
  'type','checked','disabled','readonly',
  'data-diagram','data-rendered',
  // table alignment
  'align','colspan','rowspan',
  // SVG
  'viewBox','xmlns','xmlns:xlink','fill','stroke','stroke-width','d',
  'cx','cy','r','x','y','width','height',
  'x1','y1','x2','y2','rx','ry','points','transform',
  'markerEnd','markerStart','refX','refY','markerWidth','markerHeight','orient',
  'text-anchor','font-size','font-family','dominant-baseline',
  'xlink:href',
];

export function parseMarkdown(content: string): string {
  const raw = marked.parse(content) as string;
  if (typeof window === 'undefined') return raw;
  return DOMPurify.sanitize(raw, { ALLOWED_TAGS, ALLOWED_ATTR, ADD_DATA_URI_TAGS: ['img'] });
}
