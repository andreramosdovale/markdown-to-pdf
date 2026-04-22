const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const markedKatex = require('marked-katex-extension');
const puppeteer = require('puppeteer');

marked.use(markedKatex({ throwOnError: false }));

const katexCSS = fs.readFileSync(
  path.join(require.resolve('katex'), '../../dist/katex.min.css'),
  'utf-8'
);

function buildHTML(body) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    ${katexCSS}
    body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.7; max-width: 800px; margin: 0 auto; padding: 40px 60px; color: #1a1a1a; }
    h1, h2, h3, h4 { font-family: Arial, sans-serif; margin-top: 1.5em; }
    h1 { font-size: 2em; border-bottom: 2px solid #333; padding-bottom: 0.2em; }
    h2 { font-size: 1.5em; border-bottom: 1px solid #ccc; padding-bottom: 0.15em; }
    code { background: #f4f4f4; border-radius: 3px; padding: 0.1em 0.35em; font-size: 0.9em; font-family: monospace; }
    pre code { display: block; padding: 1em; overflow-x: auto; }
    blockquote { border-left: 4px solid #aaa; margin: 0; padding-left: 1em; color: #555; }
    table { border-collapse: collapse; width: 100%; margin: 1em 0; }
    th, td { border: 1px solid #ccc; padding: 0.4em 0.8em; }
    th { background: #f0f0f0; }
    .katex-display { overflow-x: auto; }
  </style>
</head>
<body>${body}</body>
</html>`;
}

async function convert(inputPath, outputPath) {
  const markdown = fs.readFileSync(inputPath, 'utf-8');
  const html = buildHTML(marked.parse(markdown));

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '15mm', right: '15mm' },
  });
  await browser.close();

  console.log(`PDF gerado: ${outputPath}`);
}

const [,, input, output] = process.argv;

if (!input) {
  console.error('Uso: node index.js <arquivo.md> [saida.pdf]');
  process.exit(1);
}

const inputFile = path.resolve(input);
const outputFile = output ? path.resolve(output) : inputFile.replace(/\.md$/i, '.pdf');

convert(inputFile, outputFile).catch((err) => {
  console.error('Erro:', err.message);
  process.exit(1);
});
