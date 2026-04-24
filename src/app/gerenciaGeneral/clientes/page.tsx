import ClientesTable from "@/components/dashboard/ClientesTable";

export default function ClientesPage() {
  return (
    <div className="flex flex-col">
      <header className="flex flex-col gap-6 border-b border-[color:var(--color-rule)] px-10 py-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-500)]">
            Proceso 05 · Cartera de clientes
          </span>
          <h1 className="font-display text-[clamp(28px,3.2vw,38px)] font-medium leading-[1.05] tracking-[-0.015em] text-[color:var(--color-ink-900)]">
            Clientes registrados
          </h1>
          <p className="text-[13px] text-[color:var(--color-ink-500)]">
            Contribuyentes dados de alta en el Proceso A ·{" "}
            <span className="num" data-tnum>
              Abril 2026
            </span>
          </p>
        </div>

        <label className="flex items-baseline gap-2 border-b border-[color:var(--color-rule-strong)] pb-1">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-ink-500)]">
            Filtrar
          </span>
          <select
            defaultValue="todos"
            className="appearance-none bg-transparent text-[13px] font-medium text-[color:var(--color-ink-900)] focus:outline-none"
          >
            <option value="todos">Todos</option>
            <option value="activos">Activos · Habidos</option>
            <option value="suspendidos">Suspensión temporal</option>
            <option value="no-habidos">No habidos</option>
          </select>
        </label>
      </header>

      <ClientesTable />

      <footer className="flex flex-wrap items-baseline justify-between gap-3 border-t border-[color:var(--color-rule)] bg-[color:var(--color-paper-200)] px-10 py-5 text-[11px] text-[color:var(--color-ink-500)]">
        <span>
          ORAID · Cartera de clientes · sincronizado con el Proceso A de
          registro.
        </span>
        <span className="num" data-tnum>
          v0.3 · build 2026.04.23
        </span>
      </footer>
    </div>
  );
}
