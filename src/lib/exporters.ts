export type ExportColumn<T> = {
  header: string;
  value: (row: T) => string | number;
  align?: "left" | "right";
};

function csvEscape(raw: string | number): string {
  const s = String(raw);
  if (/[",;\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportToExcel<T>(
  filename: string,
  columns: ExportColumn<T>[],
  rows: T[],
): void {
  const header = columns.map((c) => csvEscape(c.header)).join(",");
  const body = rows
    .map((row) => columns.map((c) => csvEscape(c.value(row))).join(","))
    .join("\r\n");
  const BOM = "﻿";
  const csv = `${BOM}sep=,\r\n${header}\r\n${body}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  downloadBlob(blob, filename.endsWith(".csv") ? filename : `${filename}.csv`);
}

export function exportToPdf<T>(
  title: string,
  subtitle: string,
  columns: ExportColumn<T>[],
  rows: T[],
): void {
  const now = new Date();
  const stamp = now.toLocaleString("es-PE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const headerCells = columns
    .map(
      (c) =>
        `<th style="text-align:${c.align ?? "left"}">${escapeHtml(c.header)}</th>`,
    )
    .join("");

  const bodyRows = rows
    .map(
      (row) =>
        `<tr>${columns
          .map(
            (c) =>
              `<td style="text-align:${c.align ?? "left"}">${escapeHtml(
                String(c.value(row)),
              )}</td>`,
          )
          .join("")}</tr>`,
    )
    .join("");

  const doc = `<!doctype html>
<html lang="es-PE">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;font-family:"Public Sans",ui-sans-serif,system-ui,sans-serif;color:#1d1f24;background:#fff}
  .sheet{padding:32px 28px}
  header{display:flex;align-items:flex-end;justify-content:space-between;border-bottom:2px solid #1d1f24;padding-bottom:14px;margin-bottom:18px}
  .brand{font-family:Georgia,"Times New Roman",serif;font-size:22px;font-weight:600;letter-spacing:-0.01em}
  .brand small{font-family:"Public Sans",sans-serif;font-weight:500;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#6a6e78;margin-left:10px}
  .meta{text-align:right;font-size:10px;color:#6a6e78;letter-spacing:0.06em;text-transform:uppercase}
  h1{font-family:Georgia,serif;font-size:18px;font-weight:600;margin:0 0 4px}
  .subtitle{font-size:11px;color:#6a6e78;letter-spacing:0.12em;text-transform:uppercase;margin-bottom:12px}
  table{width:100%;border-collapse:collapse;font-size:10.5px}
  thead th{text-align:left;font-size:9px;letter-spacing:0.1em;text-transform:uppercase;color:#6a6e78;font-weight:600;padding:8px 10px;border-bottom:1.5px solid #1d1f24}
  tbody td{padding:8px 10px;border-bottom:1px solid #d8d6cf;vertical-align:top}
  tbody tr:nth-child(even){background:#faf8f3}
  footer{margin-top:18px;font-size:9px;color:#6a6e78;letter-spacing:0.06em;text-transform:uppercase;display:flex;justify-content:space-between;border-top:1px solid #d8d6cf;padding-top:10px}
  @page{size:A4 landscape;margin:14mm}
</style>
</head>
<body>
  <div class="sheet">
    <header>
      <div class="brand">ORAID<small>Estudio fiscal digital</small></div>
      <div class="meta">Generado · ${escapeHtml(stamp)}</div>
    </header>
    <div class="subtitle">${escapeHtml(subtitle)}</div>
    <h1>${escapeHtml(title)}</h1>
    <table>
      <thead><tr>${headerCells}</tr></thead>
      <tbody>${bodyRows}</tbody>
    </table>
    <footer>
      <span>ORAID · vista exportada</span>
      <span>${rows.length} registros</span>
    </footer>
  </div>
</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");
  iframe.srcdoc = doc;
  iframe.onload = () => {
    const win = iframe.contentWindow;
    if (!win) return;
    win.focus();
    win.print();
    setTimeout(() => {
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
    }, 1000);
  };
  document.body.appendChild(iframe);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
