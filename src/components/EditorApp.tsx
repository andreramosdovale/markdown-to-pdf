import { useState, useEffect, useCallback } from 'react';
import TopBar from './TopBar';
import SplitPane from './SplitPane';
import SettingsDrawer from './SettingsDrawer';
import { loadContent, saveContent, loadSettings, saveSettings } from '../lib/storage';
import { exportPdf } from '../lib/pdf';

export type ViewMode = 'split' | 'editor' | 'preview';

export interface Settings {
  pageSize: 'A4' | 'Letter' | 'A3';
  margins: { top: number; bottom: number; left: number; right: number };
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
}

const DEFAULT_SETTINGS: Settings = {
  pageSize: 'A4',
  margins: { top: 20, bottom: 20, left: 15, right: 15 },
  fontFamily: 'Georgia, serif',
  fontSize: 12,
  lineHeight: 1.7,
};

const DEMO_CONTENT = `# Welcome to Markdown → PDF

Write your document here. The preview updates as you type.

## Mermaid Diagrams

\`\`\`mermaid
flowchart LR
  A[Write Markdown] --> B[Preview]
  B --> C{Happy?}
  C -- Yes --> D[Export PDF]
  C -- No  --> A
\`\`\`

## Math Formulas

Inline: $E = mc^2$

Block:

$$\\int_{-\\infty}^{\\infty} e^{-x^2}\\, dx = \\sqrt{\\pi}$$

## Code

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
\`\`\`

## Table

| Feature       | Supported |
|---------------|-----------|
| Mermaid       | ✓         |
| Math (KaTeX)  | ✓         |
| Syntax HL     | ✓         |
| Dark mode     | ✓         |

> **Tip:** Use **Alt+1/2/3** to switch view modes, and **Ctrl+P** to export.
`;

export default function EditorApp() {
  const [content, setContent]           = useState(() => loadContent() ?? DEMO_CONTENT);
  const [settings, setSettings]         = useState<Settings>(() => loadSettings() ?? DEFAULT_SETTINGS);
  const [viewMode, setViewMode]         = useState<ViewMode>('split');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode]         = useState(false);

  useEffect(() => { saveContent(content); }, [content]);
  useEffect(() => { saveSettings(settings); }, [settings]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.altKey && e.key === '1') { setViewMode('editor');  e.preventDefault(); }
      if (e.altKey && e.key === '2') { setViewMode('split');   e.preventDefault(); }
      if (e.altKey && e.key === '3') { setViewMode('preview'); e.preventDefault(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        exportPdf(settings);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [settings]);

  const handleExport = useCallback(() => exportPdf(settings), [settings]);

  return (
    <div className="flex flex-col h-screen bg-bg">
      <TopBar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onExport={handleExport}
        onSettingsOpen={() => setSettingsOpen(true)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <main className="flex-1 overflow-hidden">
        <SplitPane
          content={content}
          onContentChange={setContent}
          viewMode={viewMode}
          settings={settings}
          darkMode={darkMode}
        />
      </main>

      <SettingsDrawer
        open={settingsOpen}
        settings={settings}
        onSettingsChange={setSettings}
        onClose={() => setSettingsOpen(false)}
        defaultSettings={DEFAULT_SETTINGS}
      />
    </div>
  );
}
