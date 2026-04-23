# Business Rules — Markdown to PDF (React Application)

## 1. Overview

This document defines the functional and technical requirements for rebuilding the existing Node.js CLI tool as a full React web application. The core purpose is to convert Markdown documents — including Mermaid diagrams, math formulas, and all CommonMark/GFM syntax — into high-fidelity, print-ready PDFs directly in the browser.

---

## 2. Functional Requirements

### 2.1 Input

| # | Rule |
|---|------|
| FR-01 | The user must be able to type or paste Markdown text in a live editor. |
| FR-02 | The user must be able to upload a `.md` or `.txt` file via drag-and-drop or a file picker. |
| FR-03 | The editor must auto-detect and preserve the original file encoding (UTF-8). |
| FR-04 | The editor must persist content in `localStorage` to survive page refreshes. |

### 2.2 Preview

| # | Rule |
|---|------|
| FR-05 | A real-time rendered preview must be displayed alongside the editor (split-pane layout). |
| FR-06 | The preview must update within 300 ms of the user stopping typing (debounced). |
| FR-07 | The preview must accurately represent the final PDF output (WYSIWYG). |
| FR-08 | The user may toggle between **Editor only**, **Split view**, and **Preview only** modes. |

### 2.3 PDF Export

| # | Rule |
|---|------|
| FR-09 | The user must be able to export the document to PDF with a single click. |
| FR-10 | PDF generation must occur entirely in the browser (no server calls). |
| FR-11 | The exported PDF must match the rendered preview exactly. |
| FR-12 | The user must be able to configure the PDF page size (A4, Letter, A3). |
| FR-13 | The user must be able to configure page margins (top, bottom, left, right). |
| FR-14 | The default output filename must be derived from the first `# Heading` in the document, falling back to `document.pdf`. |

---

## 3. Markdown Feature Support

All features below **must** be rendered correctly in both the preview and the exported PDF.

### 3.1 CommonMark / GFM Syntax

| Feature | Syntax Example | Required |
|---------|---------------|----------|
| Headings H1–H6 | `# H1` … `###### H6` | Yes |
| Bold | `**text**` | Yes |
| Italic | `*text*` | Yes |
| Bold + Italic | `***text***` | Yes |
| Strikethrough | `~~text~~` | Yes |
| Inline code | `` `code` `` | Yes |
| Fenced code block | ```` ```lang ``` ```` | Yes |
| Syntax highlighting | ```` ```js ```` | Yes |
| Blockquote | `> text` | Yes |
| Nested blockquotes | `>> text` | Yes |
| Ordered list | `1. item` | Yes |
| Unordered list | `- item` | Yes |
| Nested lists | Indented items | Yes |
| Task list | `- [x] done` / `- [ ] todo` | Yes |
| Horizontal rule | `---` | Yes |
| Link | `[label](url)` | Yes |
| Image | `![alt](url)` | Yes |
| Table | GFM pipe syntax | Yes |
| Table alignment | `:---:` / `---:` / `:---` | Yes |
| Footnotes | `[^1]` | Yes |
| Definition lists | `term\n: definition` | Yes |
| Inline HTML | `<br>`, `<mark>`, etc. | Yes |
| Hard line break | Two trailing spaces | Yes |
| Emoji shortcodes | `:smile:` | Optional |

### 3.2 Math Formulas (KaTeX)

| # | Rule |
|---|------|
| MD-01 | Inline math must be rendered using `$...$` syntax. |
| MD-02 | Block math must be rendered using `$$...$$` syntax. |
| MD-03 | KaTeX errors must fail gracefully (render raw LaTeX, never crash). |
| MD-04 | Math must be crisp and selectable in the PDF (vector, not rasterized). |

### 3.3 Syntax Highlighting (Code Blocks)

| # | Rule |
|---|------|
| MD-05 | Code blocks must support syntax highlighting for at minimum: `js`, `ts`, `python`, `bash`, `json`, `yaml`, `html`, `css`, `sql`, `go`, `rust`, `java`, `c`, `cpp`. |
| MD-06 | The highlighting theme must be consistent between preview and PDF. |
| MD-07 | Code blocks must display the language label in the top-right corner. |
| MD-08 | Long lines in code blocks must not overflow the PDF page (horizontal scroll in preview, soft-wrap in PDF). |

---

## 4. Mermaid Diagram Support

Mermaid is a first-class feature. All diagrams must render in preview and be embedded as vector graphics (SVG) in the PDF.

### 4.1 Supported Diagram Types

| Type | Keyword | Required |
|------|---------|----------|
| Flowchart | `flowchart LR / TD` | Yes |
| Sequence Diagram | `sequenceDiagram` | Yes |
| Class Diagram | `classDiagram` | Yes |
| State Diagram | `stateDiagram-v2` | Yes |
| Entity-Relationship | `erDiagram` | Yes |
| Gantt Chart | `gantt` | Yes |
| Pie Chart | `pie` | Yes |
| Git Graph | `gitGraph` | Yes |
| Mindmap | `mindmap` | Optional |
| Timeline | `timeline` | Optional |
| Quadrant Chart | `quadrantChart` | Optional |

### 4.2 Mermaid Rules

| # | Rule |
|---|------|
| MR-01 | Mermaid blocks must use the fenced code block syntax: ```` ```mermaid ````. |
| MR-02 | Diagrams must render as inline SVG within the preview (not as `<img>` tags). |
| MR-03 | For PDF export, each diagram SVG must be inlined and fully self-contained (no external references). |
| MR-04 | Diagrams that are wider than the page must scale down proportionally to fit the PDF column. |
| MR-05 | Mermaid syntax errors must display a visible error box with the error message instead of crashing the renderer. |
| MR-06 | Diagrams must respect the document's color theme (light/dark). |

---

## 5. User Interface Requirements

> **Design Philosophy — Usability First**
> Usability is the single most important design concern for this application. Every layout decision, interaction pattern, and visual choice must be evaluated primarily by whether it makes the tool faster and more intuitive to use. Features that add visual complexity without improving the user's ability to write, preview, or export documents must be rejected. When in doubt, simplify.

### 5.0 Usability Principles

| # | Principle | What it means in practice |
|---|-----------|--------------------------|
| UP-01 | **Zero learning curve** | A user who has never seen the app must be able to write Markdown and export a PDF within 60 seconds of opening it, with no instructions. |
| UP-02 | **Immediate feedback** | Every action (typing, uploading, exporting) must produce visible feedback within 300 ms. Spinners, progress indicators, or inline errors must appear before the operation completes. |
| UP-03 | **No dead ends** | Every error state must tell the user exactly what went wrong and offer a clear recovery path (e.g., "Invalid Mermaid syntax on line 3 — [fix it](#)" or a dismiss button). |
| UP-04 | **Preserve user work** | Content is auto-saved to `localStorage` after every keystroke. The user must never lose work due to an accidental page refresh or browser close. |
| UP-05 | **Progressive disclosure** | Advanced settings (margins, font, metadata) are hidden in a drawer. The default view exposes only what 90% of users need: editor, preview, and export. |
| UP-06 | **Keyboard-first** | All primary actions (export, toggle view, open settings) must be reachable via keyboard shortcuts without touching the mouse. Shortcuts must be discoverable via tooltip on hover. |
| UP-07 | **Consistent visual language** | Buttons, inputs, and interactive elements must follow a single, consistent visual language defined by Tailwind design tokens. No ad-hoc inline styles. |
| UP-08 | **Ads must not degrade usability** | Ad placements (see Section 11) must never overlap, obscure, or reflow the editor or preview pane. Usability is non-negotiable even in ad-supported layouts. |

### 5.1 Layout

| # | Rule |
|---|------|
| UI-01 | The application must have a top navigation bar with: app name/logo, view toggle buttons, settings button, and Export PDF button. |
| UI-02 | The split-pane layout must be resizable via a draggable divider. |
| UI-03 | The editor pane must display line numbers. |
| UI-04 | The preview pane must have a fixed-width container that matches A4 proportions to simulate the PDF page. |
| UI-05 | The application must support Light and Dark themes. The theme preference must be persisted in `localStorage`. |

### 5.2 Editor

| # | Rule |
|---|------|
| UI-06 | The editor must support basic keyboard shortcuts: `Ctrl+B` (bold), `Ctrl+I` (italic), `Ctrl+K` (link), `Ctrl+Z` / `Ctrl+Y` (undo/redo). |
| UI-07 | The editor must highlight matching brackets and parentheses. |
| UI-08 | Tab key must insert 2 spaces (not a real tab character). |

### 5.3 PDF Settings Panel

| # | Rule |
|---|------|
| UI-09 | A settings panel (slide-out drawer or modal) must allow configuration of: page size, margins, font family, base font size, and line height. |
| UI-10 | Settings must be persisted in `localStorage`. |
| UI-11 | A "Reset to defaults" button must restore all settings to their initial values. |

---

## 6. PDF Generation Rules

| # | Rule |
|---|------|
| PDF-01 | PDF generation must use `window.print()` triggered from a hidden iframe, or a library such as `html2pdf.js` or `jsPDF` with `html2canvas`. The chosen approach must preserve SVG Mermaid diagrams as vectors. |
| PDF-02 | Page breaks must be avoided inside headings, code blocks, tables, and Mermaid diagrams. |
| PDF-03 | Images must be embedded as Base64 data URIs to ensure they render offline. |
| PDF-04 | Hyperlinks in the PDF must remain clickable. |
| PDF-05 | The PDF must include PDF metadata: title (first H1), author (optional, configurable), creation date. |
| PDF-06 | A table of contents may be optionally generated from headings (H1–H3) and appended before the first page. |

---

## 7. Technical Architecture

### 7.1 Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Meta-framework | Astro 4+ | Static-first, islands architecture, zero JS by default |
| UI Components | React 18+ (Astro island) with TypeScript | Interactive islands only where needed |
| Build Tool | Astro (Vite-based internally) | Fast HMR, native ESM, built-in optimizations |
| Styling | Tailwind CSS v3 | Utility-first, consistent design tokens, purge-safe |
| Markdown Parser | `marked` + GFM extensions | Already proven in current CLI tool |
| Math Rendering | `KaTeX` via `marked-katex-extension` | Already proven in current CLI tool |
| Syntax Highlighting | `highlight.js` or `Prism.js` | Broad language support |
| Mermaid Rendering | `mermaid.js` | Official Mermaid library |
| Code Editor | `CodeMirror 6` (React island) | Performance, extensibility |
| PDF Export | `html2pdf.js` (wrapper over `html2canvas` + `jsPDF`) or print CSS | Must keep SVGs as vectors |
| State Management | React Context + `useReducer` inside island (no Redux) | Proportional to app complexity |

> **Architecture note:** Astro renders the page shell, header, footer, and static content as zero-JS HTML. The editor + preview pane is a single React island (`client:load`). The settings drawer is a separate React island (`client:idle`). This keeps the initial JS bundle minimal and improves Core Web Vitals scores, which directly impacts Google AdSense approval and RPM.

### 7.2 Key Components

```
App
├── TopBar
│   ├── ViewToggle
│   ├── SettingsButton
│   └── ExportButton
├── SplitPane
│   ├── EditorPane (CodeMirror 6)
│   └── PreviewPane
│       └── MarkdownRenderer
│           ├── MermaidBlock
│           ├── MathBlock (KaTeX)
│           └── CodeBlock (highlight.js)
└── SettingsDrawer
```

### 7.3 Rendering Pipeline

```
User Input (Markdown text)
        │
        ▼
   marked.parse()          ← CommonMark + GFM + KaTeX tokens
        │
        ▼
  React dangerouslySetInnerHTML (sanitized)
        │
        ├─► MermaidBlock   ← detect ```mermaid, call mermaid.render()
        ├─► KaTeX blocks   ← already tokenized by marked-katex-extension
        └─► CodeBlock      ← highlight.js after-render pass
        │
        ▼
   Preview DOM
        │
        ▼ (on Export click)
  Clone preview DOM
  → inline all styles
  → resolve all images to Base64
  → render Mermaid SVGs inline
        │
        ▼
   html2pdf / print()  →  PDF file download
```

---

## 8. Non-Functional Requirements

| # | Category | Rule |
|---|----------|------|
| NFR-01 | Performance | Initial page load must be under 3 seconds on a standard 4G connection. |
| NFR-02 | Performance | Live preview re-render must complete within 300 ms for documents up to 10,000 words. |
| NFR-03 | Performance | Mermaid diagrams must render within 1 second each. |
| NFR-04 | Reliability | The app must never crash due to invalid Markdown or Mermaid syntax; all errors must be caught and displayed inline. |
| NFR-05 | Accessibility | The UI must meet WCAG 2.1 AA contrast requirements. |
| NFR-06 | Browser Support | Must support the two latest stable versions of Chrome, Firefox, Edge, and Safari. |
| NFR-07 | Offline | The app must function fully offline after the first load (all fonts and assets bundled or cached). |
| NFR-08 | Security | User Markdown input must be sanitized with `DOMPurify` before being inserted into the DOM to prevent XSS. Allowed exceptions: `<mark>`, `<kbd>`, `<sub>`, `<sup>`. |

---

## 9. Monetization — Google AdSense

### 9.1 Strategy

The application is monetized through Google AdSense display ads. Revenue is generated by impressions and clicks from users who visit the web app. The monetization model must never compromise the core usability principle (UP-08): ads are guests, the editor is the host.

### 9.2 AdSense Compliance Requirements

| # | Rule |
|---|------|
| MON-01 | The site must comply fully with [Google AdSense Program Policies](https://support.google.com/adsense/answer/48182). |
| MON-02 | The site must have a Privacy Policy page disclosing cookie and ad data usage before applying for AdSense. |
| MON-03 | The site must have sufficient original content (landing page, documentation, about page) to pass AdSense review. |
| MON-04 | Ads must never be placed in a way that invites accidental clicks (e.g., adjacent to the Export button). |
| MON-05 | No more than 3 AdSense ad units per page, per Google's guidelines. |
| MON-06 | Auto-ads must be tested against the split-pane layout to ensure they never inject inside the editor or preview pane. If auto-ads cause layout issues, use manually placed units only. |

### 9.3 Ad Placement Rules

| Slot | Position | Unit Size | Condition |
|------|----------|-----------|-----------|
| `ad-top` | Below the top navigation bar, above the editor | Responsive leaderboard (`728×90` desktop / `320×50` mobile) | Always visible |
| `ad-sidebar` | Right side of the page, outside the split-pane | Responsive rectangle (`300×250` or `160×600`) | Desktop only (≥ 1280 px wide) |
| `ad-bottom` | Below the editor/preview area, above the footer | Responsive leaderboard | Always visible |

> **Rule:** The `ad-sidebar` slot must only appear when the screen is wide enough that the split-pane retains its full usable width after the ad column is added. On screens narrower than 1280 px, the sidebar ad must not render.

### 9.4 Layout Impact Rules

| # | Rule |
|---|------|
| MON-07 | Ad containers must have a fixed reserved height (e.g., `min-height: 90px` for leaderboard slots) to prevent Cumulative Layout Shift (CLS) while ads load. CLS must remain below 0.1 to protect Core Web Vitals and AdSense RPM. Ad slots must use `min-height` on all screen sizes to avoid reflow. |
| MON-08 | Ads must not be placed inside the PDF preview pane. They must not appear in the exported PDF under any circumstances. |
| MON-09 | On mobile (< 768 px), only the `ad-top` slot is shown. The bottom slot is hidden to preserve screen space for the editor. |
| MON-10 | Ad containers must be clearly separated from content with at least `16px` of whitespace and, if needed, a subtle `border-top` or background color difference — never a label like "Advertisement" unless required by policy. |

### 9.5 Performance Impact

| # | Rule |
|---|------|
| MON-11 | The AdSense `<script>` tag must be loaded with `async` and placed before `</body>` (or via Astro's `<head>` slot with `async`), never blocking the critical rendering path. |
| MON-12 | Ad loading must not delay the Time to Interactive (TTI) of the editor island. The editor must be interactive before any ad network callbacks fire. |
| MON-13 | The LCP score must remain under 2.5 seconds with ads enabled. If ads cause an LCP regression, the `ad-top` slot must be moved below the fold. |

### 9.6 Revenue Optimization Guidelines

| # | Guideline |
|---|-----------|
| MON-14 | Use Responsive ad units for all slots so Google selects the highest-paying format per screen size. |
| MON-15 | Enable **Auto Ads** as a supplement to manual placements, but constrain the injection zone to the page shell (header/footer areas) via the AdSense panel's "Exclude areas" setting. |
| MON-16 | Monitor RPM and CTR in the AdSense dashboard weekly during the first month. Adjust slot positions based on impression visibility (aim for > 70% visible impressions per slot). |
| MON-17 | Consider linking AdSense with Google Analytics 4 to correlate user engagement with ad revenue and identify high-value traffic sources. |

---

## 10. Out of Scope (v1.0)

- User accounts or cloud storage
- Real-time collaboration
- Export formats other than PDF (DOCX, HTML)
- Custom CSS theming by the user
- Backend/server-side processing

---

## 10. Definition of Done

A feature is considered complete when:

1. It renders correctly in the split-pane preview.
2. It is faithfully reproduced in the exported PDF.
3. Invalid syntax for that feature shows a graceful error, not a crash.
4. The feature works offline (no CDN dependencies).
5. Covered by at least one integration test (render in / PDF out).
