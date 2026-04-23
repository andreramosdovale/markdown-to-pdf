import type { Settings } from '../components/EditorApp';

const CONTENT_KEY = 'md2pdf:content';
const SETTINGS_KEY = 'md2pdf:settings';

export function loadContent(): string | null {
  try { return localStorage.getItem(CONTENT_KEY); }
  catch { return null; }
}

export function saveContent(content: string): void {
  try { localStorage.setItem(CONTENT_KEY, content); }
  catch { /* storage quota exceeded */ }
}

export function loadSettings(): Settings | null {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? (JSON.parse(raw) as Settings) : null;
  } catch { return null; }
}

export function saveSettings(settings: Settings): void {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }
  catch { /* storage quota exceeded */ }
}
