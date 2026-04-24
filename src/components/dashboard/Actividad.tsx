const MONTHS = ["Nov", "Dic", "Ene", "Feb", "Mar", "Abr"] as const;
const GUIAS = [890, 960, 1040, 1125, 1210, 1284] as const;
const DECLARACIONES = [118, 124, 131, 128, 140, 147] as const;

const W = 720;
const H = 260;
const PAD_L = 52;
const PAD_R = 24;
const PAD_T = 24;
const PAD_B = 44;

const Y_MAX = 1400;
const Y_TICKS = [0, 350, 700, 1050, 1400] as const;

function x(i: number): number {
  const span = MONTHS.length - 1;
  return PAD_L + ((W - PAD_L - PAD_R) * i) / span;
}

function y(v: number): number {
  const h = H - PAD_T - PAD_B;
  return PAD_T + h - (v / Y_MAX) * h;
}

function line(values: readonly number[]): string {
  return values
    .map((v, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
    .join(" ");
}

export default function Actividad() {
  return (
    <section
      aria-label="Actividad de los últimos 6 meses"
      className="flex flex-col px-8 py-7"
    >
      <div className="flex items-baseline justify-between pb-5">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--color-ink-500)]">
            Actividad · últimos 6 meses
          </span>
          <h2 className="font-display text-[20px] font-semibold leading-none text-[color:var(--color-ink-900)]">
            Guías vs Declaraciones
          </h2>
        </div>
        <ul className="flex items-center gap-4 text-[11px] uppercase tracking-[0.08em]">
          <li className="flex items-center gap-2 text-[color:var(--color-ink-700)]">
            <span className="h-[2px] w-5 bg-[color:var(--color-link)]" />
            Guías
          </li>
          <li className="flex items-center gap-2 text-[color:var(--color-ink-700)]">
            <span className="h-[2px] w-5 bg-[color:var(--color-verify)]" />
            Declaraciones
          </li>
        </ul>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          role="img"
          aria-label="Línea de tiempo con guías emitidas y declaraciones procesadas"
          className="block h-auto w-full"
        >
          {/* Y grid + labels */}
          {Y_TICKS.map((t) => (
            <g key={t}>
              <line
                x1={PAD_L}
                x2={W - PAD_R}
                y1={y(t)}
                y2={y(t)}
                stroke="var(--color-rule)"
                strokeWidth={1}
              />
              <text
                x={PAD_L - 10}
                y={y(t)}
                textAnchor="end"
                dominantBaseline="central"
                fontSize={10}
                fontFamily="var(--font-public-sans)"
                fill="var(--color-ink-500)"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {t.toLocaleString("es-PE")}
              </text>
            </g>
          ))}

          {/* X labels */}
          {MONTHS.map((m, i) => (
            <text
              key={m}
              x={x(i)}
              y={H - PAD_B + 20}
              textAnchor="middle"
              fontSize={11}
              fontFamily="var(--font-public-sans)"
              fill="var(--color-ink-500)"
            >
              {m}
            </text>
          ))}

          {/* Guías line */}
          <path
            d={line(GUIAS)}
            fill="none"
            stroke="var(--color-link)"
            strokeWidth={1.75}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {GUIAS.map((v, i) => (
            <circle
              key={`g-${i}`}
              cx={x(i)}
              cy={y(v)}
              r={3}
              fill="var(--color-paper-100)"
              stroke="var(--color-link)"
              strokeWidth={1.5}
            />
          ))}

          {/* Declaraciones line */}
          <path
            d={line(DECLARACIONES)}
            fill="none"
            stroke="var(--color-verify)"
            strokeWidth={1.75}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          {DECLARACIONES.map((v, i) => (
            <circle
              key={`d-${i}`}
              cx={x(i)}
              cy={y(v)}
              r={3}
              fill="var(--color-paper-100)"
              stroke="var(--color-verify)"
              strokeWidth={1.5}
            />
          ))}

          {/* Last-value labels */}
          <text
            x={x(MONTHS.length - 1) + 8}
            y={y(GUIAS[GUIAS.length - 1]) - 6}
            fontSize={11}
            fontFamily="var(--font-public-sans)"
            fill="var(--color-link)"
            style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}
            textAnchor="end"
          >
            {GUIAS[GUIAS.length - 1].toLocaleString("es-PE")}
          </text>
          <text
            x={x(MONTHS.length - 1) + 8}
            y={y(DECLARACIONES[DECLARACIONES.length - 1]) - 6}
            fontSize={11}
            fontFamily="var(--font-public-sans)"
            fill="var(--color-verify)"
            style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}
            textAnchor="end"
          >
            {DECLARACIONES[DECLARACIONES.length - 1].toLocaleString("es-PE")}
          </text>
        </svg>
      </div>

      <p className="pt-4 text-[11px] text-[color:var(--color-ink-500)]">
        Datos consolidados al cierre diario · fuente interna ORAID.
      </p>
    </section>
  );
}
