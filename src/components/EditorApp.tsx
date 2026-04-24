import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import TopBar from './TopBar';
import SplitPane from './SplitPane';
import SettingsDrawer from './SettingsDrawer';
import { loadContent, saveContent, loadSettings, saveSettings } from '../lib/storage';
import { exportPdf } from '../lib/pdf';
import DEMO_CONTENT from '../demo.md?raw';

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

export default function EditorApp() {
  const [content, setContent]           = useState(() => loadContent() ?? DEMO_CONTENT);
  const [settings, setSettings]         = useState<Settings>(() => loadSettings() ?? DEFAULT_SETTINGS);
  const [viewMode, setViewMode]         = useState<ViewMode>('split');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches,
  );

  useEffect(() => {
    const id = setTimeout(() => saveContent(content), 500);
    return () => clearTimeout(id);
  }, [content]);
  useEffect(() => { saveSettings(settings); }, [settings]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

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
    <>
      <Helmet>
        <title>Markdown to PDF Converter — Free, Online, No Install</title>
        <meta name="description" content="Convert Markdown to PDF instantly in your browser. Supports Mermaid diagrams, KaTeX math formulas, syntax highlighting and dark mode. No upload, no server, completely free." />
        <link rel="canonical" href="https://YOUR-DOMAIN.com/" />
      </Helmet>
    <div className="flex flex-col h-full bg-bg">
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
    </>
  );
}
