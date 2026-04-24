"use client";

import { useMemo, useState } from "react";
import {
  exportToExcel,
  exportToPdf,
  type ExportColumn,
} from "@/lib/exporters";
import {
  ActionsBar,
  CheckBox,
  Divider,
  Metric,
  pad,
  stamp,
} from "@/components/dashboard/tableShell";

type Estado = "Pagado" | "Pendiente" | "Vencido";

type Recibo = {
  id: string;
  numero: string;
  emision: string;
  vencimiento: string;
  cliente: string;
  ruc: string;
  concepto: string;
  bruto: number;
  retencion: number;
  estado: Estado;
};

function neto(r: Recibo): number {
  return r.bruto - r.retencion;
}

const SEED: Recibo[] = [
  { id: "h-001", numero: "E001-000482", emision: "01/04/2026", vencimiento: "10/04/2026", cliente: "Inversiones Andinas SAC", ruc: "20512345671", concepto: "Contabilidad — marzo 2026", bruto: 1800, retencion: 144, estado: "Pagado" },
  { id: "h-002", numero: "E001-000483", emision: "01/04/2026", vencimiento: "10/04/2026", cliente: "Distribuidora El Sol EIRL", ruc: "20498877123", concepto: "Contabilidad — marzo 2026", bruto: 950, retencion: 76, estado: "Pagado" },
  { id: "h-003", numero: "E001-000484", emision: "01/04/2026", vencimiento: "10/04/2026", cliente: "Comercial Ríos & Hermanos SRL", ruc: "20587744119", concepto: "Planilla — marzo 2026", bruto: 720, retencion: 57.6, estado: "Pendiente" },
  { id: "h-004", numero: "E001-000485", emision: "01/04/2026", vencimiento: "10/04/2026", cliente: "Textiles Camaná SAC", ruc: "20455661102", concepto: "Asesoría tributaria — marzo 2026", bruto: 2400, retencion: 192, estado: "Pagado" },
  { id: "h-005", numero: "E001-000470", emision: "01/03/2026", vencimiento: "10/03/2026", cliente: "Servicios Mineros Yauli SAC", ruc: "20577889102", concepto: "Declaración anual — ejercicio 2025", bruto: 3500, retencion: 280, estado: "Vencido" },
  { id: "h-006", numero: "E001-000486", emision: "01/04/2026", vencimiento: "10/04/2026", cliente: "Agroexport Pachacámac SAC", ruc: "20601122334", concepto: "Contabilidad — marzo 2026", bruto: 2100, retencion: 168, estado: "Pendiente" },
];

const ESTADO_TONE: Record<Estado, string> = {
  Pagado: "text-[color:var(--color-verify)]",
  Pendiente: "text-[color:var(--color-ink-700)]",
  Vencido: "text-[color:var(--color-alert)]",
};

const COLUMNS: ExportColumn<Recibo>[] = [
  { header: "Recibo", value: (r) => r.numero },
  { header: "Emisión", value: (r) => r.emision },
  { header: "Vence", value: (r) => r.vencimiento },
  { header: "Cliente", value: (r) => r.cliente },
  { header: "RUC", value: (r) => r.ruc },
  { header: "Concepto", value: (r) => r.concepto },
  { header: "Bruto (S/)", value: (r) => r.bruto.toFixed(2), align: "right" },
  { header: "Retención (S/)", value: (r) => r.retencion.toFixed(2), align: "right" },
  { header: "Neto (S/)", value: (r) => neto(r).toFixed(2), align: "right" },
  { header: "Estado", value: (r) => r.estado },
];

function formatSoles(n: number): string {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function HonorariosTable() {
  const [items, setItems] = useState<Recibo[]>(SEED);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const facturado = items.reduce((sum, r) => sum + r.bruto, 0);
  const porCobrar = items
    .filter((r) => r.estado !== "Pagado")
    .reduce((sum, r) => sum + neto(r), 0);
  const vencidos = items.filter((r) => r.estado === "Vencido").length;
  const allSelected = items.length > 0 && selected.size === items.length;
  const someSelected = selected.size > 0 && selected.size < items.length;

  const exportRows = useMemo(
    () => (selected.size === 0 ? items : items.filter((r) => selected.has(r.id))),
    [items, selected],
  );

  function toggleAll(): void {
    setSelected(allSelected ? new Set() : new Set(items.map((r) => r.id)));
  }
  function toggleOne(id: string): void {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  function removeRow(id: string): void {
    setItems((prev) => prev.filter((x) => x.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  return (
    <section aria-label="Recibos por honorarios" className="flex flex-col" data-section-in>
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[color:var(--color-rule)] px-10 py-6">
        <div className="flex items-baseline gap-6">
          <Metric label="Recibos" value={pad(items.length)} />
          <Divider />
          <Metric label="Facturado" value={formatSoles(facturado)} />
          <Divider />
          <Metric label="Por cobrar" value={formatSoles(porCobrar)} tone="alert" />
          <Divider />
          <Metric label="Vencidos" value={pad(vencidos)} tone="alert" />
        </div>
        <span className="text-[11px] text-[color:var(--color-ink-500)]">
          Origen ·{" "}
          <span className="text-[color:var(--color-ink-700)]">
            Proceso A · Servicios contratados
          </span>
        </span>
      </div>

      <ActionsBar
        selectedCount={selected.size}
        totalCount={items.length}
        noun={{ singular: "recibo", plural: "recibos" }}
        onExcel={() => exportToExcel(`oraid-honorarios-${stamp()}`, COLUMNS, exportRows)}
        onPdf={() =>
          exportToPdf("Recibos por honorarios", "Proceso 06 · Abril 2026", COLUMNS, exportRows)
        }
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-[color:var(--color-rule-strong)] text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-ink-500)]">
              <th scope="col" className="w-10 pl-10 pr-3 py-3 font-medium">
                <CheckBox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={toggleAll}
                  ariaLabel="Seleccionar todos los recibos"
                />
              </th>
              <th scope="col" className="py-3 pr-6 font-medium">Recibo</th>
              <th scope="col" className="py-3 pr-6 font-medium">Emisión</th>
              <th scope="col" className="py-3 pr-6 font-medium">Vence</th>
              <th scope="col" className="py-3 pr-6 font-medium">Cliente</th>
              <th scope="col" className="py-3 pr-6 font-medium">Concepto</th>
              <th scope="col" className="py-3 pr-6 text-right font-medium">Bruto</th>
              <th scope="col" className="py-3 pr-6 text-right font-medium">Retención 8%</th>
              <th scope="col" className="py-3 pr-6 text-right font-medium">Neto</th>
              <th scope="col" className="py-3 pr-6 font-medium">Estado</th>
              <th scope="col" className="py-3 pr-10 text-right font-medium">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-10 py-16 text-center text-[13px] text-[color:var(--color-ink-500)]">
                  No quedan recibos visibles en el tablero. Recarga la página
                  para restaurar el listado.
                </td>
              </tr>
            ) : (
              items.map((r, i) => {
                const isSel = selected.has(r.id);
                return (
                  <tr
                    key={r.id}
                    data-row-in
                    style={{ ["--row-index" as never]: i }}
                    className={`border-b border-[color:var(--color-rule)] align-top transition-colors ${
                      isSel
                        ? "bg-[color:var(--color-paper-200)]"
                        : "hover:bg-[color:var(--color-paper-200)]"
                    }`}
                  >
                    <td className="w-10 pl-10 pr-3 py-4">
                      <CheckBox
                        checked={isSel}
                        onChange={() => toggleOne(r.id)}
                        ariaLabel={`Seleccionar recibo ${r.numero}`}
                      />
                    </td>
                    <td className="py-4 pr-6">
                      <span className="num text-[13px] font-medium text-[color:var(--color-ink-900)]" data-tnum>
                        {r.numero}
                      </span>
                    </td>
                    <td className="num py-4 pr-6 text-[13px] text-[color:var(--color-ink-700)]" data-tnum>
                      {r.emision}
                    </td>
                    <td className="num py-4 pr-6 text-[13px] text-[color:var(--color-ink-700)]" data-tnum>
                      {r.vencimiento}
                    </td>
                    <td className="py-4 pr-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] text-[color:var(--color-ink-900)]">{r.cliente}</span>
                        <span className="num text-[11px] text-[color:var(--color-ink-500)]" data-tnum>
                          RUC {r.ruc}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-6 text-[12px] text-[color:var(--color-ink-700)]">{r.concepto}</td>
                    <td className="num py-4 pr-6 text-right text-[13px] text-[color:var(--color-ink-700)]" data-tnum>
                      {formatSoles(r.bruto)}
                    </td>
                    <td className="num py-4 pr-6 text-right text-[13px] text-[color:var(--color-ink-500)]" data-tnum>
                      −{formatSoles(r.retencion)}
                    </td>
                    <td className="num py-4 pr-6 text-right text-[13px] font-medium text-[color:var(--color-ink-900)]" data-tnum>
                      {formatSoles(neto(r))}
                    </td>
                    <td className={`py-4 pr-6 text-[12px] font-medium uppercase tracking-[0.06em] ${ESTADO_TONE[r.estado]}`}>
                      {r.estado}
                    </td>
                    <td className="py-4 pr-10 text-right">
                      <button
                        type="button"
                        onClick={() => removeRow(r.id)}
                        className="rounded-sm border border-[color:var(--color-rule-strong)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-ink-700)] transition-all duration-200 ease-out hover:-translate-y-px hover:border-[color:var(--color-alert)] hover:text-[color:var(--color-alert)]"
                        aria-label={`Quitar recibo ${r.numero} del tablero`}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="border-t border-[color:var(--color-rule)] bg-[color:var(--color-paper-200)] px-10 py-4 text-[11px] text-[color:var(--color-ink-500)]">
        Vista de solo lectura · al quitar un recibo se oculta del tablero sin
        afectar el libro de honorarios.
      </p>
    </section>
  );
}
