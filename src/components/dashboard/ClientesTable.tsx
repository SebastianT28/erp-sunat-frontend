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

type EstadoSunat = "Activo · Habido" | "Suspensión temporal" | "No habido";

type Cliente = {
  id: string;
  razonSocial: string;
  ruc: string;
  regimen: "NRUS" | "RER" | "RMT" | "Régimen General";
  servicio:
    | "Contabilidad mensual"
    | "Planilla"
    | "Declaración anual"
    | "Asesoría tributaria";
  tarifa: number;
  contacto: string;
  estado: EstadoSunat;
  alta: string;
};

const SEED: Cliente[] = [
  { id: "c-001", razonSocial: "Inversiones Andinas SAC", ruc: "20512345671", regimen: "Régimen General", servicio: "Contabilidad mensual", tarifa: 1800, contacto: "contacto@andinas.pe", estado: "Activo · Habido", alta: "12/01/2025" },
  { id: "c-002", razonSocial: "Distribuidora El Sol EIRL", ruc: "20498877123", regimen: "RMT", servicio: "Contabilidad mensual", tarifa: 950, contacto: "gerencia@elsol.pe", estado: "Activo · Habido", alta: "03/03/2025" },
  { id: "c-003", razonSocial: "Comercial Ríos & Hermanos SRL", ruc: "20587744119", regimen: "RER", servicio: "Planilla", tarifa: 720, contacto: "rios.hnos@correo.pe", estado: "Suspensión temporal", alta: "21/06/2024" },
  { id: "c-004", razonSocial: "Textiles Camaná SAC", ruc: "20455661102", regimen: "Régimen General", servicio: "Asesoría tributaria", tarifa: 2400, contacto: "finanzas@camana.pe", estado: "Activo · Habido", alta: "08/11/2023" },
  { id: "c-005", razonSocial: "Agroexport Pachacámac SAC", ruc: "20601122334", regimen: "Régimen General", servicio: "Contabilidad mensual", tarifa: 2100, contacto: "admin@agropacha.pe", estado: "Activo · Habido", alta: "17/02/2026" },
  { id: "c-006", razonSocial: "Servicios Mineros Yauli SAC", ruc: "20577889102", regimen: "Régimen General", servicio: "Declaración anual", tarifa: 3500, contacto: "tributacion@yauli.pe", estado: "Activo · Habido", alta: "29/09/2024" },
  { id: "c-007", razonSocial: "Panadería La Espiga EIRL", ruc: "20488991230", regimen: "NRUS", servicio: "Contabilidad mensual", tarifa: 380, contacto: "espiga@correo.pe", estado: "No habido", alta: "14/05/2025" },
];

const ESTADO_TONE: Record<EstadoSunat, string> = {
  "Activo · Habido": "text-[color:var(--color-verify)]",
  "Suspensión temporal": "text-[color:var(--color-ink-700)]",
  "No habido": "text-[color:var(--color-alert)]",
};

const COLUMNS: ExportColumn<Cliente>[] = [
  { header: "Razón social", value: (c) => c.razonSocial },
  { header: "RUC", value: (c) => c.ruc },
  { header: "Régimen", value: (c) => c.regimen },
  { header: "Servicio", value: (c) => c.servicio },
  { header: "Contacto", value: (c) => c.contacto },
  { header: "Alta", value: (c) => c.alta },
  { header: "Estado SUNAT", value: (c) => c.estado },
  { header: "Tarifa (S/)", value: (c) => c.tarifa.toFixed(2), align: "right" },
];

function formatSoles(n: number): string {
  return `S/ ${n.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ClientesTable() {
  const [items, setItems] = useState<Cliente[]>(SEED);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const cartera = items.reduce((sum, c) => sum + c.tarifa, 0);
  const activos = items.filter((c) => c.estado === "Activo · Habido").length;
  const allSelected = items.length > 0 && selected.size === items.length;
  const someSelected = selected.size > 0 && selected.size < items.length;

  const exportRows = useMemo(
    () => (selected.size === 0 ? items : items.filter((c) => selected.has(c.id))),
    [items, selected],
  );

  function toggleAll(): void {
    setSelected(allSelected ? new Set() : new Set(items.map((c) => c.id)));
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
    <section aria-label="Cartera de clientes" className="flex flex-col" data-section-in>
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[color:var(--color-rule)] px-10 py-6">
        <div className="flex items-baseline gap-6">
          <Metric label="En cartera" value={pad(items.length)} />
          <Divider />
          <Metric label="Activos · Habidos" value={pad(activos)} tone="verify" />
          <Divider />
          <Metric label="Cartera mensual" value={formatSoles(cartera)} />
        </div>
        <span className="text-[11px] text-[color:var(--color-ink-500)]">
          Origen ·{" "}
          <span className="text-[color:var(--color-ink-700)]">
            Proceso A · Registro de contribuyente
          </span>
        </span>
      </div>

      <ActionsBar
        selectedCount={selected.size}
        totalCount={items.length}
        noun={{ singular: "cliente", plural: "clientes" }}
        onExcel={() => exportToExcel(`oraid-clientes-${stamp()}`, COLUMNS, exportRows)}
        onPdf={() =>
          exportToPdf("Cartera de clientes", "Proceso 05 · Abril 2026", COLUMNS, exportRows)
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
                  ariaLabel="Seleccionar todos los clientes"
                />
              </th>
              <th scope="col" className="py-3 pr-6 font-medium">Razón social</th>
              <th scope="col" className="py-3 pr-6 font-medium">Régimen</th>
              <th scope="col" className="py-3 pr-6 font-medium">Servicio</th>
              <th scope="col" className="py-3 pr-6 font-medium">Contacto</th>
              <th scope="col" className="py-3 pr-6 font-medium">Alta</th>
              <th scope="col" className="py-3 pr-6 font-medium">Estado SUNAT</th>
              <th scope="col" className="py-3 pr-6 text-right font-medium">Tarifa</th>
              <th scope="col" className="py-3 pr-10 text-right font-medium">
                <span className="sr-only">Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-10 py-16 text-center text-[13px] text-[color:var(--color-ink-500)]">
                  No quedan clientes visibles en el tablero. Recarga la página
                  para restaurar el listado.
                </td>
              </tr>
            ) : (
              items.map((c, i) => {
                const isSel = selected.has(c.id);
                return (
                  <tr
                    key={c.id}
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
                        onChange={() => toggleOne(c.id)}
                        ariaLabel={`Seleccionar cliente ${c.razonSocial}`}
                      />
                    </td>
                    <td className="py-4 pr-6">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[13px] font-medium text-[color:var(--color-ink-900)]">
                          {c.razonSocial}
                        </span>
                        <span className="num text-[11px] text-[color:var(--color-ink-500)]" data-tnum>
                          RUC {c.ruc}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 pr-6 text-[12px] text-[color:var(--color-ink-700)]">{c.regimen}</td>
                    <td className="py-4 pr-6 text-[12px] text-[color:var(--color-ink-700)]">{c.servicio}</td>
                    <td className="py-4 pr-6 text-[12px] text-[color:var(--color-ink-700)]">{c.contacto}</td>
                    <td className="num py-4 pr-6 text-[13px] text-[color:var(--color-ink-700)]" data-tnum>
                      {c.alta}
                    </td>
                    <td className={`py-4 pr-6 text-[12px] font-medium uppercase tracking-[0.06em] ${ESTADO_TONE[c.estado]}`}>
                      {c.estado}
                    </td>
                    <td className="num py-4 pr-6 text-right text-[13px] font-medium text-[color:var(--color-ink-900)]" data-tnum>
                      {formatSoles(c.tarifa)}
                    </td>
                    <td className="py-4 pr-10 text-right">
                      <button
                        type="button"
                        onClick={() => removeRow(c.id)}
                        className="rounded-sm border border-[color:var(--color-rule-strong)] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-ink-700)] transition-all duration-200 ease-out hover:-translate-y-px hover:border-[color:var(--color-alert)] hover:text-[color:var(--color-alert)]"
                        aria-label={`Quitar cliente ${c.razonSocial} del tablero`}
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
        Vista de solo lectura · al quitar un cliente se oculta del tablero sin
        afectar el padrón del Proceso A.
      </p>
    </section>
  );
}
