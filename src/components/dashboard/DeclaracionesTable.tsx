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

type Estado = "Presentada" | "Rectificatoria" | "Pendiente";

type Declaracion = {
  id: string;
  formulario: string;
  orden: string;
  periodo: string;
  tipo: string;
  cliente: string;
  ruc: string;
  presentacion: string;
  estado: Estado;
  monto: number;
};

const SEED: Declaracion[] = [
  { id: "d-001", formulario: "PDT 621", orden: "780914552", periodo: "03/2026", tipo: "IGV — Renta mensual", cliente: "Inversiones Andinas SAC", ruc: "20512345671", presentacion: "18/04/2026", estado: "Presentada", monto: 8420.0 },
  { id: "d-002", formulario: "PDT 601", orden: "780914551", periodo: "03/2026", tipo: "PLAME — Planilla electrónica", cliente: "Distribuidora El Sol EIRL", ruc: "20498877123", presentacion: "18/04/2026", estado: "Presentada", monto: 3215.5 },
  { id: "d-003", formulario: "PDT 621", orden: "780914550", periodo: "03/2026", tipo: "IGV — Renta mensual", cliente: "Comercial Ríos & Hermanos SRL", ruc: "20587744119", presentacion: "17/04/2026", estado: "Rectificatoria", monto: 1980.75 },
  { id: "d-004", formulario: "F. 1683", orden: "780914549", periodo: "03/2026", tipo: "Renta de cuarta categoría", cliente: "Textiles Camaná SAC", ruc: "20455661102", presentacion: "16/04/2026", estado: "Presentada", monto: 540.0 },
  { id: "d-005", formulario: "PDT 621", orden: "—", periodo: "03/2026", tipo: "IGV — Renta mensual", cliente: "Agroexport Pachacámac SAC", ruc: "20601122334", presentacion: "—", estado: "Pendiente", monto: 12480.0 },
  { id: "d-006", formulario: "PDT 601", orden: "780914548", periodo: "03/2026", tipo: "PLAME — Planilla electrónica", cliente: "Servicios Mineros Yauli SAC", ruc: "20577889102", presentacion: "15/04/2026", estado: "Presentada", monto: 6780.4 },
];

const ESTADO_TONE: Record<Estado, string> = {
  Presentada: "text-[color:var(--color-verify)]",
  Rectificatoria: "text-[color:var(--color-link)]",
  Pendiente: "text-[color:var(--color-alert)]",
};

const COLUMNS: ExportColumn<Declaracion>[] = [
  { header: "Formulario", value: (d) => d.formulario },
  { header: "N° orden", value: (d) => d.orden },
  { header: "Periodo", value: (d) => d.periodo },
  { header: "Cliente", value: (d) => d.cliente },
  { header: "RUC", value: (d) => d.ruc },
  { header: "Tipo", value: (d) => d.tipo },
  { header: "Presentación", value: (d) => d.presentacion },
  { header: "Estado", value: (d) => d.estado },
  { header: "Monto (S/)", value: (d) => d.monto.toFixed(2), align: "right" },
];

function formatSoles(n: number): string {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function DeclaracionesTable() {
  const [items, setItems] = useState<Declaracion[]>(SEED);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const total = items.reduce((sum, d) => sum + d.monto, 0);
  const pendientes = items.filter((d) => d.estado === "Pendiente").length;
  const allSelected = items.length > 0 && selected.size === items.length;
  const someSelected = selected.size > 0 && selected.size < items.length;

  const exportRows = useMemo(
    () => (selected.size === 0 ? items : items.filter((d) => selected.has(d.id))),
    [items, selected],
  );

  function toggleAll(): void {
    setSelected(allSelected ? new Set() : new Set(items.map((d) => d.id)));
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
    <section aria-label="Declaraciones presentadas" className="flex flex-col" data-section-in>
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[color:var(--color-rule)] px-10 py-6">
        <div className="flex items-baseline gap-6">
          <Metric label="En el periodo" value={pad(items.length)} />
          <Divider />
          <Metric label="Pendientes" value={pad(pendientes)} tone="alert" />
          <Divider />
          <Metric label="Tributo total" value={formatSoles(total)} />
        </div>
        <span className="text-[11px] text-[color:var(--color-ink-500)]">
          Origen ·{" "}
          <span className="text-[color:var(--color-ink-700)]">
            Proceso C · Presentación SUNAT
          </span>
        </span>
      </div>

      <ActionsBar
        selectedCount={selected.size}
        totalCount={items.length}
        noun={{ singular: "declaración", plural: "declaraciones" }}
        onExcel={() => exportToExcel(`oraid-declaraciones-${stamp()}`, COLUMNS, exportRows)}
        onPdf={() =>
          exportToPdf("Declaraciones presentadas", "Proceso 04 · Abril 2026", COLUMNS, exportRows)
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
                  ariaLabel="Seleccionar todas las declaraciones"
                />
              </th>
              <th scope="col" className="py-3 pr-6 font-medium">Formulario</th>
              <th scope="col" className="py-3 pr-6 font-medium">N° orden</th>
              <th scope="col" className="py-3 pr-6 font-medium">Periodo</th>
              <th scope="col" className="py-3 pr-6 font-medium">Cliente</th>
              <th scope="col" className="py-3 pr-6 font-medium">Tipo</th>
              <th scope="col" className="py-3 pr-6 font-medium">Presentación</th>
              <th scope="col" className="py-3 pr-6 font-medium">Estado</th>
              <th scope="col" className="py-3 pr-6 text-right font-medium">Monto</th>
              <th scope="col" className="py-3 pr-10 text-right font-medium">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-10 py-16 text-center text-[13px] text-[color:var(--color-ink-500)]">
                  No quedan declaraciones visibles en el tablero. Recarga la
                  página para restaurar el listado.
                </td>
              </tr>
            ) : (
              items.map((d, i) => {
                const isSel = selected.has(d.id);
                return (
                  <tr
                    key={d.id}
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
                        onChange={() => toggleOne(d.id)}
                        ariaLabel={`Seleccionar declaración ${d.formulario} ${d.orden}`}
                      />
                    </td>
                    <td className="py-4 pr-6">
                      <span className="text-[13px] font-medium text-[color:var(--color-ink-900)]">
                        {d.formulario}
                      </span>
                    </td>
                    <td className="num py-4 pr-6 text-[13px] text-[color:var(--color-ink-700)]" data-tnum>
                      {d.orden}
                    </td>
                    <td className="num py-4 pr-6 text-[13px] text-[color:var(--color-ink-700)]" data-tnum>
                      {d.periodo}
                    </td>
                    <td className="py-4 pr-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] text-[color:var(--color-ink-900)]">{d.cliente}</span>
                        <span className="num text-[11px] text-[color:var(--color-ink-500)]" data-tnum>
                          RUC {d.ruc}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-6 text-[12px] text-[color:var(--color-ink-700)]">{d.tipo}</td>
                    <td className="num py-4 pr-6 text-[13px] text-[color:var(--color-ink-700)]" data-tnum>
                      {d.presentacion}
                    </td>
                    <td className={`py-4 pr-6 text-[12px] font-medium uppercase tracking-[0.06em] ${ESTADO_TONE[d.estado]}`}>
                      {d.estado}
                    </td>
                    <td className="num py-4 pr-6 text-right text-[13px] font-medium text-[color:var(--color-ink-900)]" data-tnum>
                      {formatSoles(d.monto)}
                    </td>
                    <td className="py-4 pr-10 text-right">
                      <button
                        type="button"
                        onClick={() => removeRow(d.id)}
                        className="rounded-sm border border-[color:var(--color-rule-strong)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-ink-700)] transition-all duration-200 ease-out hover:-translate-y-px hover:border-[color:var(--color-alert)] hover:text-[color:var(--color-alert)]"
                        aria-label={`Quitar declaración ${d.formulario} ${d.orden} del tablero`}
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
        Vista de solo lectura · al quitar una declaración se oculta del tablero
        sin afectar el archivo del Proceso C.
      </p>
    </section>
  );
}
