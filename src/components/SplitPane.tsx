import { useRef, useEffect, useCallback } from 'react';
import type { ViewMode, Settings } from './EditorApp';
import CodeMirrorEditor from './CodeMirrorEditor';
import MarkdownPreview from './MarkdownPreview';

interface Props {
  content: string;
  onContentChange: (value: string) => void;
  viewMode: ViewMode;
  settings: Settings;
  darkMode: boolean;
}

export default function SplitPane({ content, onContentChange, viewMode, settings, darkMode }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const applyRatio = useCallback((ratio: number) => {
    const el = containerRef.current;
    if (!el) return;
    const children = el.children;
    (children[0] as HTMLElement).style.width = `${ratio * 100}%`;
    (children[2] as HTMLElement).style.width = `${(1 - ratio) * 100}%`;
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const divider = el.children[1] as HTMLElement;
    if (!divider) return;

    const onMouseDown = (e: MouseEvent) => {
      dragging.current = true;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const rect = el.getBoundingClientRect();
      applyRatio(Math.min(0.85, Math.max(0.15, (e.clientX - rect.left) / rect.width)));
    };

    const onMouseUp = () => {
      if (!dragging.current) return;
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    divider.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      divider.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [applyRatio]);

  if (viewMode === 'editor') {
    return (
      <div className="h-full bg-surface-alt">
        <CodeMirrorEditor value={content} onChange={onContentChange} darkMode={darkMode} />
      </div>
    );
  }

  if (viewMode === 'preview') {
    return (
      <PreviewPane content={content} settings={settings} darkMode={darkMode} />
    );
  }

  return (
    <div ref={containerRef} className="flex h-full overflow-hidden">
      {/* Editor side */}
      <div style={{ width: '50%' }} className="overflow-hidden shrink-0 bg-surface-alt">
        <CodeMirrorEditor value={content} onChange={onContentChange} darkMode={darkMode} />
      </div>

      {/* Drag handle */}
      <div className="split-divider" />

      {/* Preview side */}
      <div style={{ width: '50%' }} className="shrink-0 overflow-hidden">
        <PreviewPane content={content} settings={settings} darkMode={darkMode} />
      </div>
    </div>
  );
}

function PreviewPane({ content, settings, darkMode }: { content: string; settings: Settings; darkMode: boolean }) {
  return (
    <div className="h-full overflow-y-auto bg-bg px-6 py-8">
      <div className="paper">
        <MarkdownPreview content={content} settings={settings} darkMode={darkMode} />
      </div>
    </div>
  );
}
