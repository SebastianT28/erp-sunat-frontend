type Estado = "Pendiente" | "Moroso" | "En proceso" | "Al día";

type Alerta = {
  cliente: string;
  ruc: string;
  concepto: string;
  vence: string;
  estado: Estado;
};

const ALERTAS: Alerta[] = [
  {
    cliente: "Transportes Hagemsa S.A.C.",
    ruc: "20547821034",
    concepto: "Declaración IGV–Renta",
    vence: "19 abr",
    estado: "Pendiente",
  },
  {
    cliente: "Inversiones San Isidro E.I.R.L.",
    ruc: "20601223390",
    concepto: "Declaración IGV–Renta",
    vence: "21 abr",
    estado: "Pendiente",
  },
  {
    cliente: "Comercial Arequipa S.R.L.",
    ruc: "20487002118",
    concepto: "Honorarios abril",
    vence: "22 abr",
    estado: "Moroso",
  },
  {
    cliente: "Logística del Sur S.A.",
    ruc: "20512477889",
    concepto: "Declaración IGV–Renta",
    vence: "24 abr",
    estado: "En proceso",
  },
  {
    cliente: "Textiles Lima Norte S.A.C.",
    ruc: "20601998273",
    concepto: "Planilla PDT 601",
    vence: "26 abr",
    estado: "En proceso",
  },
];

function chipClasses(estado: Estado): string {
  switch (estado) {
    case "Moroso":
      return "bg-[color:var(--color-alert-soft)] text-[color:var(--color-alert)]";
    case "Pendiente":
      return "bg-[color:var(--color-paper-300)] text-[color:var(--color-ink-900)]";
    case "En proceso":
      return "bg-[color:var(--color-verify-soft)] text-[color:var(--color-verify)]";
    case "Al día":
      return "bg-[color:var(--color-verify-soft)] text-[color:var(--color-verify)]";
  }
}

export default function Alertas() {
  return (
    <section
      aria-label="Alertas de vencimiento"
      className="flex flex-col px-8 py-7"
    >
      <div className="flex items-baseline justify-between pb-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--color-ink-500)]">
            Alertas de vencimiento
          </span>
          <h2 className="font-display text-[20px] font-semibold leading-none text-[color:var(--color-ink-900)]">
            Próximos 7 días
          </h2>
        </div>
        <a
          href="#"
          className="text-[12px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-ink-700)] transition-colors hover:text-[color:var(--color-ink-900)]"
        >
          Ver todas →
        </a>
      </div>

      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-y border-[color:var(--color-rule)]">
            <th
              scope="col"
              className="py-3 text-[10px] font-medium uppercase tracking-[0.12em] text-[color:var(--color-ink-500)]"
            >
              Cliente
            </th>
            <th
              scope="col"
              className="py-3 text-[10px] font-medium uppercase tracking-[0.12em] text-[color:var(--color-ink-500)]"
            >
              Concepto
            </th>
            <th
              scope="col"
              className="py-3 text-right text-[10px] font-medium uppercase tracking-[0.12em] text-[color:var(--color-ink-500)]"
            >
              Vence
            </th>
            <th
              scope="col"
              className="py-3 text-right text-[10px] font-medium uppercase tracking-[0.12em] text-[color:var(--color-ink-500)]"
            >
              Estado
            </th>
          </tr>
        </thead>
        <tbody>
          {ALERTAS.map((a) => (
            <tr
              key={a.ruc}
              className="border-b border-[color:var(--color-rule)] align-baseline"
            >
              <td className="py-3">
                <div className="flex flex-col">
                  <span className="text-[14px] text-[color:var(--color-ink-900)]">
                    {a.cliente}
                  </span>
                  <span
                    className="num text-[11px] text-[color:var(--color-ink-500)]"
                    data-tnum
                  >
                    RUC {a.ruc}
                  </span>
                </div>
              </td>
              <td className="py-3 text-[13px] text-[color:var(--color-ink-700)]">
                {a.concepto}
              </td>
              <td
                className="num py-3 text-right text-[13px] text-[color:var(--color-ink-900)]"
                data-tnum
              >
                {a.vence}
              </td>
              <td className="py-3 text-right">
                <span
                  className={`inline-block rounded-sm px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] ${chipClasses(
                    a.estado
                  )}`}
                >
                  {a.estado}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
