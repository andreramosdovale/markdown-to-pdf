import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import EditorApp from './components/EditorApp';
import AdSlot from './components/AdSlot';
import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div className="flex flex-col h-screen overflow-hidden">
      <AdSlot slot="ad-top" />

      <div className="flex-1 min-h-0 flex overflow-hidden">
        <div className="flex-1 min-w-0 min-h-0">
          <EditorApp />
        </div>

        <aside
          className="hidden xl:flex flex-col items-center pt-4 px-2 shrink-0 w-[168px]"
          style={{
            borderLeft: '1px solid var(--color-border-subtle)',
            background: 'var(--color-surface-alt)',
          }}
          data-no-print
        >
          <AdSlot slot="ad-sidebar" />
        </aside>
      </div>

      <AdSlot slot="ad-bottom" />
    </div>
  </StrictMode>,
);
