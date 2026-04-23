import type { ViewMode } from './EditorApp';

interface Props {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onExport: () => void;
  onSettingsOpen: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

const MODES: { value: ViewMode; label: string; title: string }[] = [
  { value: 'editor',  label: 'Edit',    title: 'Editor only — Alt+1' },
  { value: 'split',   label: 'Split',   title: 'Split view — Alt+2'  },
  { value: 'preview', label: 'Preview', title: 'Preview only — Alt+3' },
];

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.89 1.38a6.5 6.5 0 1 0 9.23 9.23A5.5 5.5 0 0 1 2.89 1.38z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M7.5 1v1.5M7.5 12.5V14M1 7.5h1.5M12.5 7.5H14M2.93 2.93l1.06 1.06M10.95 10.95l1.06 1.06M2.93 12.07l1.06-1.06M10.95 4.05l1.06-1.06" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 9.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="1.2"/>
    <path d="M12.07 5.57a5 5 0 0 0-.44-.76l.5-1.38-1.56-1.56-1.38.5a5 5 0 0 0-.76-.44L8 .5H6l-.43 1.43a5 5 0 0 0-.76.44l-1.38-.5L1.87 3.43l.5 1.38a5 5 0 0 0-.44.76L.5 6v2l1.43.43c.1.27.26.52.44.76l-.5 1.38 1.56 1.56 1.38-.5c.24.18.49.34.76.44L6 14.5h2l.43-1.43c.27-.1.52-.26.76-.44l1.38.5 1.56-1.56-.5-1.38c.18-.24.34-.49.44-.76L14.5 9V7l-2.43-.43z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ExportIcon = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 1v9M4 7l3.5 3.5L11 7M2.5 11.5v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function TopBar({
  viewMode, onViewModeChange,
  onExport, onSettingsOpen,
  darkMode, onDarkModeToggle,
}: Props) {
  return (
    <header
      className="flex items-center justify-between px-4 border-b border-border-subtle shrink-0 z-20 sticky top-0 backdrop-blur-md"
      style={{
        height: '52px',
        backgroundColor: 'var(--topbar-bg)',
      }}
      data-no-print
    >
      {/* Logo */}
      <div className="flex items-center gap-2 select-none">
        <div
          className="w-[26px] h-[26px] rounded-sm flex items-center justify-center text-white text-xs font-semibold"
          style={{ background: 'var(--color-accent)' }}
        >
          M
        </div>
        <span className="text-base font-medium text-text-primary leading-none">
          Markdown
          <span className="text-text-muted font-normal ml-1">/ PDF</span>
        </span>
      </div>

      {/* Segmented view control */}
      <div className="segment-root" role="group" aria-label="View mode">
        {MODES.map(({ value, label, title }) => (
          <button
            key={value}
            title={title}
            onClick={() => onViewModeChange(value)}
            className={`segment-item ${
              viewMode === value ? 'segment-item--active' : 'segment-item--inactive'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5">
        <button
          className="btn-icon"
          title={darkMode ? 'Light mode' : 'Dark mode'}
          onClick={onDarkModeToggle}
        >
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </button>

        <button
          className="btn-icon"
          title="Settings"
          onClick={onSettingsOpen}
        >
          <SettingsIcon />
        </button>

        <div className="w-px h-4 bg-border mx-1" />

        <button
          className="btn-primary"
          title="Export PDF — Ctrl+P"
          onClick={onExport}
        >
          <ExportIcon />
          Export PDF
        </button>
      </div>
    </header>
  );
}
