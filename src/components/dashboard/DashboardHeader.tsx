export default function DashboardHeader() {
  return (
    <header className="flex flex-col gap-6 border-b border-[color:var(--color-rule)] px-10 py-8 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-500)]">
          Proceso D · Vista gerencial
        </span>
        <h1 className="font-display text-[clamp(28px,3.2vw,38px)] font-medium leading-[1.05] tracking-[-0.015em] text-[color:var(--color-ink-900)]">
          Dashboard gerencial
        </h1>
        <p className="text-[13px] text-[color:var(--color-ink-500)]">
          Estudio contable ORAID ·{" "}
          <span className="num" data-tnum>
            Abril 2026
          </span>{" "}
          · cerrado al{" "}
          <span className="num" data-tnum>
            23/04
          </span>{" "}
          09:15
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
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
            <option value="2026-01">Enero 2026</option>
          </select>
        </label>
        <button
          type="button"
          className="rounded-sm border border-[color:var(--color-ink-900)] bg-[color:var(--color-ink-900)] px-4 py-2 text-[12px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-paper-100)] transition-[transform,background-color] duration-200 ease-out hover:-translate-y-px hover:bg-[color:var(--color-ink-700)]"
        >
          Exportar PDF
        </button>
        <button
          type="button"
          className="rounded-sm border border-[color:var(--color-rule-strong)] px-4 py-2 text-[12px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-ink-900)] transition-colors hover:border-[color:var(--color-ink-900)]"
        >
          Exportar Excel
        </button>
      </div>
    </header>
  );
}
