import GuiasTable from "@/components/dashboard/GuiasTable";

export default function GuiasPage() {
  return (
    <div className="flex flex-col">
      <header className="flex flex-col gap-6 border-b border-[color:var(--color-rule)] px-10 py-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-500)]">
            Proceso 03 · Guías de remisión
          </span>
          <h1 className="font-display text-[clamp(28px,3.2vw,38px)] font-medium leading-[1.05] tracking-[-0.015em] text-[color:var(--color-ink-900)]">
            Guías emitidas
          </h1>
          <p className="text-[13px] text-[color:var(--color-ink-500)]">
            Listado consolidado de guías cargadas desde el Proceso B ·{" "}
            <span className="num" data-tnum>
              Abril 2026
            </span>
          </p>
        </div>

        <label className="flex items-baseline gap-2 border-b border-[color:var(--color-rule-strong)] pb-1">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-ink-500)]">
            Periodo
          </span>
          <select
            defaultValue="2026-04"
            className="num appearance-none bg-transparent text-[13px] font-medium text-[color:var(--color-ink-900)] focus:outline-none"
            data-tnum
          >
            <option value="2026-04">Abril 2026</option>
            <option value="2026-03">Marzo 2026</option>
            <option value="2026-02">Febrero 2026</option>
          </select>
        </label>
      </header>

      <GuiasTable />

      <footer className="flex flex-wrap items-baseline justify-between gap-3 border-t border-[color:var(--color-rule)] bg-[color:var(--color-paper-200)] px-10 py-5 text-[11px] text-[color:var(--color-ink-500)]">
        <span>
          ORAID · Guías de remisión · sincronizado con el Proceso B de emisión.
        </span>
        <span className="num" data-tnum>
          v0.3 · build 2026.04.23
        </span>
      </footer>
    </div>
  );
}
