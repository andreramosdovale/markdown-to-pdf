import type { Settings } from '../components/EditorApp';

export function exportPdf(settings: Settings): void {
  const existing = document.getElementById('print-page-style');
  if (existing) existing.remove();

  const style = document.createElement('style');
  style.id = 'print-page-style';
  style.textContent = `
    @page {
      size: ${settings.pageSize};
      margin: ${settings.margins.top}mm ${settings.margins.right}mm ${settings.margins.bottom}mm ${settings.margins.left}mm;
    }
    #preview-content {
      font-family: ${settings.fontFamily};
      font-size: ${settings.fontSize}pt;
      line-height: ${settings.lineHeight};
    }
  `;
  document.head.appendChild(style);
  window.print();
}
