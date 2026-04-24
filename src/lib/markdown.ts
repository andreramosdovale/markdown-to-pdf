import { marked } from 'marked';
import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import css from 'highlight.js/lib/languages/css';
import go from 'highlight.js/lib/languages/go';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import rust from 'highlight.js/lib/languages/rust';
import shell from 'highlight.js/lib/languages/shell';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import yaml from 'highlight.js/lib/languages/yaml';
import DOMPurify from 'dompurify';

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('css', css);
hljs.registerLanguage('go', go);
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('json', json);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('yml', yaml);

// KaTeX is loaded only when the document first contains a $ sign.
// Avoids adding ~250 KB to the initial hydration bundle.
let _katexPromise: Promise<void> | null = null;

export function preloadKatex(): Promise<void> {
  if (!_katexPromise) {
    _katexPromise = import('marked-katex-extension').then(({ default: markedKatex }) => {
      marked.use(markedKatex({ throwOnError: false }));
    });
  }
  return _katexPromise;
}

marked.use({
  renderer: {
    code({ text, lang }) {
      if (lang === 'mermaid') {
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
  'svg','g','path','rect','circle','ellipse','line','polyline','polygon',
  'text','tspan','defs','marker','use','foreignObject',
];

const ALLOWED_ATTR = [
  'href','src','alt','title','class','id','style',
  'type','checked','disabled','readonly',
  'data-diagram','data-rendered',
  'align','colspan','rowspan',
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
