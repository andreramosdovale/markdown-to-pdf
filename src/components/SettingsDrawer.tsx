import type { Settings } from './EditorApp';

interface Props {
  open: boolean;
  settings: Settings;
  onSettingsChange: (s: Settings) => void;
  onClose: () => void;
  defaultSettings: Settings;
}

const FONTS = [
  { label: 'Georgia',            value: 'Georgia, serif' },
  { label: 'Times New Roman',    value: '"Times New Roman", Times, serif' },
  { label: 'Arial',              value: 'Arial, sans-serif' },
  { label: 'Helvetica',          value: 'Helvetica, Arial, sans-serif' },
  { label: 'Courier New (Mono)', value: '"Courier New", Courier, monospace' },
];

const MARGINS = ['top', 'bottom', 'left', 'right'] as const;

const CloseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
    <path d="M11.5 3.5l-8 8M3.5 3.5l8 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);

export default function SettingsDrawer({ open, settings, onSettingsChange, onClose, defaultSettings }: Props) {
  if (!open) return null;

  function set<K extends keyof Settings>(key: K, value: Settings[K]) {
    onSettingsChange({ ...settings, [key]: value });
  }

  function setMargin(side: typeof MARGINS[number], value: number) {
    onSettingsChange({ ...settings, margins: { ...settings.margins, [side]: value } });
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 animate-fade-in"
        style={{ background: 'rgba(0,0,0,0.2)' }}
        onClick={onClose}
        data-no-print
      />

      {/* Drawer */}
      <aside
        className="fixed right-0 top-0 h-full z-50 flex flex-col animate-slide-in"
        style={{
          width: '288px',
          background: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border-subtle)',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.08)',
        }}
        data-no-print
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 shrink-0"
          style={{
            height: '52px',
            borderBottom: '1px solid var(--color-border-subtle)',
          }}
        >
          <span className="text-base font-medium text-text-primary">PDF Settings</span>
          <button onClick={onClose} className="btn-icon" title="Close">
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-6">

          <Section label="Page">
            <Field label="Page size">
              <select
                value={settings.pageSize}
                onChange={e => set('pageSize', e.target.value as Settings['pageSize'])}
                className="input-base"
              >
                <option value="A4">A4 — 210 × 297 mm</option>
                <option value="Letter">Letter — 216 × 279 mm</option>
                <option value="A3">A3 — 297 × 420 mm</option>
              </select>
            </Field>
          </Section>

          <Divider />

          <Section label="Typography">
            <Field label="Font family">
              <select
                value={settings.fontFamily}
                onChange={e => set('fontFamily', e.target.value)}
                className="input-base"
              >
                {FONTS.map(f => (
                  <option key={f.value} value={f.value}>{f.label}</option>
                ))}
              </select>
            </Field>

            <Field label={`Font size — ${settings.fontSize}pt`}>
              <input
                type="range" min={8} max={18} step={1}
                value={settings.fontSize}
                onChange={e => set('fontSize', Number(e.target.value))}
                className="w-full"
                style={{ accentColor: 'var(--color-accent)' }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-text-muted">8pt</span>
                <span className="text-xs text-text-muted">18pt</span>
              </div>
            </Field>

            <Field label={`Line height — ${settings.lineHeight}`}>
              <input
                type="range" min={1.2} max={2.5} step={0.1}
                value={settings.lineHeight}
                onChange={e => set('lineHeight', Number(e.target.value))}
                className="w-full"
                style={{ accentColor: 'var(--color-accent)' }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-text-muted">compact</span>
                <span className="text-xs text-text-muted">spacious</span>
              </div>
            </Field>
          </Section>

          <Divider />

          <Section label="Margins (mm)">
            <div className="grid grid-cols-2 gap-3">
              {MARGINS.map(side => (
                <Field key={side} label={side.charAt(0).toUpperCase() + side.slice(1)}>
                  <input
                    type="number" min={0} max={50}
                    value={settings.margins[side]}
                    onChange={e => setMargin(side, Number(e.target.value))}
                    className="input-base"
                  />
                </Field>
              ))}
            </div>
          </Section>

          <Divider />

          <button
            onClick={() => onSettingsChange(defaultSettings)}
            className="w-full py-2 text-sm font-medium rounded-md transition-colors duration-[180ms]"
            style={{
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
              background: 'transparent',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-alt)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            Reset to defaults
          </button>
        </div>
      </aside>
    </>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </p>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Divider() {
  return <div style={{ height: '1px', background: 'var(--color-border-subtle)' }} />;
}
