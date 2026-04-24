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

type Estado = "Aceptada" | "Pendiente" | "Observada";

type Guia = {
  id: string;
  serie: string;
  correlativo: string;
  fecha: string;
  cliente: string;
  ruc: string;
  destino: string;
  motivo: "Venta" | "Traslado entre establecimientos" | "Compra" | "Devolución";
  estado: Estado;
  monto: number;
};

const SEED: Guia[] = [
  { id: "g-001", serie: "T001", correlativo: "00001284", fecha: "22/04/2026", cliente: "Inversiones Andinas SAC", ruc: "20512345671", destino: "Av. Argentina 3450, Callao", motivo: "Venta", estado: "Aceptada", monto: 18420.5 },
  { id: "g-002", serie: "T001", correlativo: "00001283", fecha: "22/04/2026", cliente: "Distribuidora El Sol EIRL", ruc: "20498877123", destino: "Jr. Lampa 880, Cercado de Lima", motivo: "Traslado entre establecimientos", estado: "Aceptada", monto: 4290.0 },
  { id: "g-003", serie: "T001", correlativo: "00001282", fecha: "21/04/2026", cliente: "Comercial Ríos & Hermanos SRL", ruc: "20587744119", destino: "Av. La Marina 2100, San Miguel", motivo: "Venta", estado: "Pendiente", monto: 9870.75 },
  { id: "g-004", serie: "T002", correlativo: "00000456", fecha: "21/04/2026", cliente: "Textiles Camaná SAC", ruc: "20455661102", destino: "Carretera Panamericana Sur Km 38", motivo: "Venta", estado: "Observada", monto: 23150.0 },
  { id: "g-005", serie: "T001", correlativo: "00001281", fecha: "20/04/2026", cliente: "Agroexport Pachacámac SAC", ruc: "20601122334", destino: "Fundo San Pedro, Pachacámac", motivo: "Venta", estado: "Aceptada", monto: 31700.0 },
  { id: "g-006", serie: "T001", correlativo: "00001280", fecha: "19/04/2026", cliente: "Servicios Mineros Yauli SAC", ruc: "20577889102", destino: "Unidad minera Yauli, Junín", motivo: "Traslado entre establecimientos", estado: "Aceptada", monto: 12480.0 },
  { id: "g-007", serie: "T001", correlativo: "00001279", fecha: "19/04/2026", cliente: "Panadería La Espiga EIRL", ruc: "20488991230", destino: "Av. Brasil 1245, Pueblo Libre", motivo: "Compra", estado: "Aceptada", monto: 1820.4 },
];

const ESTADO_TONE: Record<Estado, string> = {
  Aceptada: "text-[color:var(--color-verify)]",
  Pendiente: "text-[color:var(--color-ink-700)]",
  Observada: "text-[color:var(--color-alert)]",
};

const COLUMNS: ExportColumn<Guia>[] = [
  { header: "Documento", value: (g) => `${g.serie}-${g.correlativo}` },
  { header: "Fecha", value: (g) => g.fecha },
  { header: "Cliente", value: (g) => g.cliente },
  { header: "RUC", value: (g) => g.ruc },
  { header: "Destino", value: (g) => g.destino },
  { header: "Motivo", value: (g) => g.motivo },
  { header: "Estado", value: (g) => g.estado },
  { header: "Monto (S/)", value: (g) => g.monto.toFixed(2), align: "right" },
];

function formatSoles(n: number): string {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function GuiasTable() {
  const [guias, setGuias] = useState<Guia[]>(SEED);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const total = guias.reduce((sum, g) => sum + g.monto, 0);
  const allSelected = guias.length > 0 && selected.size === guias.length;
  const someSelected = selected.size > 0 && selected.size < guias.length;

  const exportRows = useMemo(
    () => (selected.size === 0 ? guias : guias.filter((g) => selected.has(g.id))),
    [guias, selected],
  );

  function toggleAll(): void {
    setSelected(allSelected ? new Set() : new Set(guias.map((g) => g.id)));
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
    setGuias((prev) => prev.filter((x) => x.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  return (
    <section
      aria-label="Guías de remisión emitidas"
      className="flex flex-col"
      data-section-in
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[color:var(--color-rule)] px-10 py-6">
        <div className="flex items-baseline gap-6">
          <Metric label="Emitidas en el periodo" value={pad(guias.length)} />
          <Divider />
          <Metric label="Valor consolidado" value={formatSoles(total)} />
        </div>
        <span className="text-[11px] text-[color:var(--color-ink-500)]">
          Origen ·{" "}
          <span className="text-[color:var(--color-ink-700)]">
            Proceso B · Emisión de guías
          </span>
        </span>
      </div>

      <ActionsBar
        selectedCount={selected.size}
        totalCount={guias.length}
        noun={{ singular: "guía", plural: "guías" }}
        onExcel={() => exportToExcel(`oraid-guias-${stamp()}`, COLUMNS, exportRows)}
        onPdf={() =>
          exportToPdf("Guías de remisión", "Proceso 03 · Abril 2026", COLUMNS, exportRows)
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
                  ariaLabel="Seleccionar todas las guías"
                />
              </th>
              <th scope="col" className="py-3 pr-6 font-medium">Documento</th>
              <th scope="col" className="py-3 pr-6 font-medium">Fecha</th>
              <th scope="col" className="py-3 pr-6 font-medium">Cliente</th>
              <th scope="col" className="py-3 pr-6 font-medium">Destino</th>
              <th scope="col" className="py-3 pr-6 font-medium">Motivo</th>
              <th scope="col" className="py-3 pr-6 font-medium">Estado</th>
              <th scope="col" className="py-3 pr-6 text-right font-medium">Monto</th>
              <th scope="col" className="py-3 pr-10 text-right font-medium">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {guias.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-10 py-16 text-center text-[13px] text-[color:var(--color-ink-500)]">
                  No quedan guías visibles en el tablero. Recarga la página para
                  restaurar el listado.
                </td>
              </tr>
            ) : (
              guias.map((g, i) => {
                const isSel = selected.has(g.id);
                return (
                  <tr
                    key={g.id}
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
                        onChange={() => toggleOne(g.id)}
                        ariaLabel={`Seleccionar guía ${g.serie}-${g.correlativo}`}
                      />
                    </td>
                    <td className="py-4 pr-6">
                      <span className="num text-[13px] font-medium text-[color:var(--color-ink-900)]" data-tnum>
                        {g.serie}-{g.correlativo}
                      </span>
                    </td>
                    <td className="py-4 pr-6">
                      <span className="num text-[13px] text-[color:var(--color-ink-700)]" data-tnum>
                        {g.fecha}
                      </span>
                    </td>
                    <td className="py-4 pr-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] text-[color:var(--color-ink-900)]">
                          {g.cliente}
                        </span>
                        <span className="num text-[11px] text-[color:var(--color-ink-500)]" data-tnum>
                          RUC {g.ruc}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-6 text-[13px] text-[color:var(--color-ink-700)]">{g.destino}</td>
                    <td className="py-4 pr-6 text-[12px] text-[color:var(--color-ink-700)]">{g.motivo}</td>
                    <td className={`py-4 pr-6 text-[12px] font-medium uppercase tracking-[0.06em] ${ESTADO_TONE[g.estado]}`}>
                      {g.estado}
                    </td>
                    <td className="num py-4 pr-6 text-right text-[13px] font-medium text-[color:var(--color-ink-900)]" data-tnum>
                      {formatSoles(g.monto)}
                    </td>
                    <td className="py-4 pr-10 text-right">
                      <button
                        type="button"
                        onClick={() => removeRow(g.id)}
                        className="rounded-sm border border-[color:var(--color-rule-strong)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-ink-700)] transition-all duration-200 ease-out hover:-translate-y-px hover:border-[color:var(--color-alert)] hover:text-[color:var(--color-alert)]"
                        aria-label={`Quitar guía ${g.serie}-${g.correlativo} del tablero`}
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
        Vista de solo lectura · al quitar una guía se oculta del tablero sin
        afectar el archivo del Proceso B.
      </p>
    </section>
  );
}
