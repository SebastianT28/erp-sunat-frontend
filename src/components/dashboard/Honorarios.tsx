type Bucket = {
  label: string;
  amount: number;
  tone: "verify" | "warn" | "alert";
};

const BUCKETS: Bucket[] = [
  { label: "Al día", amount: 32180, tone: "verify" },
  { label: "Vencidos 1–30 días", amount: 11450, tone: "warn" },
  { label: "Vencidos +30 días", amount: 4690, tone: "alert" },
];

const TOTAL = BUCKETS.reduce((n, b) => n + b.amount, 0);

const TONE_BG: Record<Bucket["tone"], string> = {
  verify: "bg-[color:var(--color-verify)]",
  warn: "bg-[color:oklch(70%_0.15_70)]",
  alert: "bg-[color:var(--color-alert)]",
};

function formatSoles(n: number): string {
  return `S/ ${n.toLocaleString("es-PE")}`;
}

export default function Honorarios() {
  return (
    <section
      aria-label="Honorarios por cobrar"
      className="flex flex-col px-8 py-7"
    >
      <div className="flex items-baseline justify-between pb-5">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--color-ink-500)]">
            Honorarios por cobrar
          </span>
          <h2 className="font-display text-[20px] font-semibold leading-none text-[color:var(--color-ink-900)]">
            Antigüedad de saldo
          </h2>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-ink-500)]">
            Total
          </span>
          <span
            className="num font-display text-[22px] font-medium leading-none text-[color:var(--color-ink-900)]"
            data-tnum
          >
            {formatSoles(TOTAL)}
          </span>
        </div>
      </div>

      <ul className="flex flex-col border-t border-[color:var(--color-rule)]">
        {BUCKETS.map((b) => {
          const pct = Math.round((b.amount / TOTAL) * 100);
          return (
            <li
              key={b.label}
              className="flex flex-col gap-2 border-b border-[color:var(--color-rule)] py-4"
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[13px] text-[color:var(--color-ink-900)]">
                  {b.label}
                </span>
                <span className="flex items-baseline gap-3">
                  <span
                    className="num text-[11px] text-[color:var(--color-ink-500)]"
                    data-tnum
                  >
                    {pct}%
                  </span>
                  <span
                    className="num text-[14px] font-medium text-[color:var(--color-ink-900)]"
                    data-tnum
                  >
                    {formatSoles(b.amount)}
                  </span>
                </span>
              </div>
              <div
                className="h-[6px] w-full bg-[color:var(--color-paper-300)]"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${b.label} ${pct}%`}
              >
                <div
                  className={`h-full ${TONE_BG[b.tone]}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <p className="pt-4 text-[11px] text-[color:var(--color-ink-500)]">
        Conciliado con el libro de honorarios · corte{" "}
        <span className="num" data-tnum>
          22 abr 2026
        </span>
        .
      </p>
    </section>
  );
}
