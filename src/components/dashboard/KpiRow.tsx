type Kpi = {
  label: string;
  value: string;
  unit?: string;
  delta: string;
  tone?: "neutral" | "verify" | "alert";
  caption?: string;
};

const KPIS: Kpi[] = [
  {
    label: "Clientes activos",
    value: "147",
    delta: "+6 este mes",
    tone: "verify",
    caption: "padrón vigente",
  },
  {
    label: "Guías emitidas",
    value: "1,284",
    delta: "+38 vs marzo",
    tone: "verify",
    caption: "proceso 2",
  },
  {
    label: "Declaraciones procesadas",
    value: "132",
    unit: "/ 147",
    delta: "15 pendientes",
    tone: "alert",
    caption: "cierre 23/04",
  },
  {
    label: "Honorarios facturados",
    value: "S/ 48,320",
    delta: "+12% vs marzo",
    tone: "verify",
    caption: "IGV incluido",
  },
];

export default function KpiRow() {
  return (
    <section
      aria-label="Indicadores del periodo"
      className="grid grid-cols-1 border-b border-[color:var(--color-rule)] sm:grid-cols-2 lg:grid-cols-4"
    >
      {KPIS.map((kpi, i) => (
        <div
          key={kpi.label}
          className={`flex flex-col gap-3 px-8 py-7 ${
            i > 0 ? "border-t border-[color:var(--color-rule)] lg:border-l lg:border-t-0" : ""
          } ${i > 0 && i < 2 ? "sm:border-t-0 sm:border-l" : ""} ${
            i === 2 ? "sm:border-l-0 lg:border-l" : ""
          }`}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-ink-500)]">
              {kpi.label}
            </span>
            <span
              className="num text-[10px] uppercase tracking-[0.08em] text-[color:var(--color-ink-500)]"
              data-tnum
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="num font-display text-[34px] font-medium leading-none tracking-[-0.015em] text-[color:var(--color-ink-900)]"
              data-tnum
            >
              {kpi.value}
            </span>
            {kpi.unit ? (
              <span
                className="num text-[18px] font-medium text-[color:var(--color-ink-500)]"
                data-tnum
              >
                {kpi.unit}
              </span>
            ) : null}
          </div>
          <div className="flex items-baseline justify-between pt-1">
            <span
              className={`num text-[12px] ${
                kpi.tone === "alert"
                  ? "text-[color:var(--color-alert)]"
                  : kpi.tone === "verify"
                    ? "text-[color:var(--color-verify)]"
                    : "text-[color:var(--color-ink-700)]"
              }`}
              data-tnum
            >
              {kpi.delta}
            </span>
            {kpi.caption ? (
              <span className="text-[11px] text-[color:var(--color-ink-500)]">
                {kpi.caption}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </section>
  );
}
