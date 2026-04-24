import DashboardHeader from "@/components/dashboard/DashboardHeader";
import KpiRow from "@/components/dashboard/KpiRow";
import Alertas from "@/components/dashboard/Alertas";
import TipoCambio from "@/components/dashboard/TipoCambio";
import Honorarios from "@/components/dashboard/Honorarios";
import Actividad from "@/components/dashboard/Actividad";

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader />
      <KpiRow />

      <section className="grid grid-cols-1 border-b border-[color:var(--color-rule)] lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="border-b border-[color:var(--color-rule)] lg:border-b-0 lg:border-r">
          <Alertas />
        </div>
        <TipoCambio />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <div className="border-b border-[color:var(--color-rule)] lg:border-b-0 lg:border-r">
          <Honorarios />
        </div>
        <Actividad />
      </section>

      <footer className="flex flex-wrap items-baseline justify-between gap-3 border-t border-[color:var(--color-rule)] bg-[color:var(--color-paper-200)] px-10 py-5 text-[11px] text-[color:var(--color-ink-500)]">
        <span>
          ORAID · Dashboard gerencial · datos sincronizados con el padrón SUNAT.
        </span>
        <span className="num" data-tnum>
          v0.3 · build 2026.04.23
        </span>
      </footer>
    </div>
  );
}
