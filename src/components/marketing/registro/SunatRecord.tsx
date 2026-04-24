import type { ContribuyenteRecord } from "@/lib/sunat";
import { LABELS } from "@/lib/sunat";
import { FieldRow } from "./FieldRow";
import { StatusChip } from "./StatusChip";

type Props =
  | { state: "empty" }
  | { state: "loading"; doc: string }
  | { state: "error"; message: string }
  | { state: "ready"; record: ContribuyenteRecord };

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch {
    return "";
  }
}

function SkeletonRow({ delay }: { delay: number }) {
  return (
    <div
      className="flex items-center justify-between gap-6 border-b border-[color:var(--color-rule)] py-3"
      style={{ opacity: 0.6, animationDelay: `${delay}ms` }}
      data-ledger-row
    >
      <span className="h-2 w-20 rounded-full bg-[color:var(--color-paper-300)]" />
      <span className="h-2 w-44 rounded-full bg-[color:var(--color-paper-300)]" />
    </div>
  );
}

export function SunatRecord(props: Props) {
  return (
    <aside
      aria-label="Expediente SUNAT"
      className="flex h-full flex-col gap-5 bg-[color:var(--color-paper-200)] px-8 py-10 md:px-10"
    >
      <header className="flex items-baseline justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--color-ink-500)]">
            Expediente SUNAT
          </span>
          <h2 className="font-display text-[22px] font-semibold leading-none text-[color:var(--color-ink-900)]">
            Padrón reducido
          </h2>
        </div>
        {props.state === "ready" ? (
          <span
            className="num text-[11px] text-[color:var(--color-ink-500)]"
            data-tnum
          >
            {formatTime(props.record.consultadoEn)}
          </span>
        ) : null}
      </header>

      {props.state === "empty" ? (
        <div className="flex flex-1 flex-col items-start justify-center gap-3 border-y border-dashed border-[color:var(--color-rule)] py-10 text-[color:var(--color-ink-500)]">
          <p className="max-w-[38ch] text-[15px] leading-[1.55]">
            Ingrese un <strong className="text-[color:var(--color-ink-900)]">RUC</strong>{" "}
            o <strong className="text-[color:var(--color-ink-900)]">DNI</strong> en el
            formulario y el padrón oficial aparecerá aquí, línea por línea.
          </p>
          <p className="text-[12px] text-[color:var(--color-ink-500)]">
            Fuente: peruapi.com · actualizado al segundo
          </p>
        </div>
      ) : null}

      {props.state === "loading" ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-between border-b border-[color:var(--color-rule)] py-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[color:var(--color-ink-500)]">
              Consultando
            </span>
            <span className="num text-[13px] text-[color:var(--color-ink-700)]" data-tnum>
              {props.doc}
            </span>
          </div>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <SkeletonRow key={i} delay={i * 70} />
          ))}
        </div>
      ) : null}

      {props.state === "error" ? (
        <div className="flex flex-col gap-3 border-y border-[color:var(--color-rule)] py-6">
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-[color:var(--color-alert)]">
            No se pudo consultar
          </span>
          <p className="max-w-[40ch] text-[15px] leading-[1.5] text-[color:var(--color-ink-900)]">
            {props.message}
          </p>
        </div>
      ) : null}

      {props.state === "ready" ? (
        <div className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2 pb-4">
            {props.record.kind === "ruc" ? (
              <>
                <StatusChip
                  label="Estado"
                  value={props.record.estado}
                  kind="estado"
                />
                <StatusChip
                  label="Condición"
                  value={props.record.condicion}
                  kind="condicion"
                />
                {props.record.buenContribuyente ? (
                  <span className="rounded-sm bg-[color:var(--color-verify-soft)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-verify)]">
                    Buen contribuyente
                  </span>
                ) : null}
                {props.record.agenteRetencion ? (
                  <span className="rounded-sm bg-[color:var(--color-paper-300)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-ink-700)]">
                    Agente de retención
                  </span>
                ) : null}
                {props.record.agentePercepcion ? (
                  <span className="rounded-sm bg-[color:var(--color-paper-300)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-ink-700)]">
                    Agente de percepción
                  </span>
                ) : null}
              </>
            ) : (
              <span className="rounded-sm bg-[color:var(--color-verify-soft)] px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-verify)]">
                RENIEC · Persona natural
              </span>
            )}
          </div>

          <dl>
            <FieldRow
              delay={0}
              label={props.record.kind === "ruc" ? LABELS.ruc : LABELS.dni}
              value={<span className="num" data-tnum>{props.record.doc}</span>}
              mono
              verified
            />
            <FieldRow
              delay={70}
              label={
                props.record.kind === "ruc" ? LABELS.razonSocial : LABELS.nombres
              }
              value={props.record.razonSocial || "—"}
              verified
            />
            {props.record.tipoContribuyente ? (
              <FieldRow
                delay={140}
                label={LABELS.tipoContribuyente}
                value={props.record.tipoContribuyente}
              />
            ) : null}
            {props.record.direccion ? (
              <FieldRow
                delay={210}
                label={LABELS.direccion}
                value={props.record.direccion}
                verified
              />
            ) : null}
            {props.record.ubigeo ? (
              <FieldRow
                delay={280}
                label={LABELS.ubigeo}
                value={<span className="num" data-tnum>{props.record.ubigeo}</span>}
                mono
              />
            ) : null}
            {props.record.distrito ? (
              <FieldRow
                delay={350}
                label={LABELS.distrito}
                value={
                  [props.record.distrito, props.record.provincia, props.record.departamento]
                    .filter(Boolean)
                    .join(" · ")
                }
              />
            ) : null}
            {props.record.fechaInscripcion ? (
              <FieldRow
                delay={420}
                label={LABELS.fechaInscripcion}
                value={<span className="num" data-tnum>{props.record.fechaInscripcion}</span>}
                mono
              />
            ) : null}
            {props.record.actividadEconomica ? (
              <FieldRow
                delay={490}
                label={LABELS.actividadEconomica}
                value={props.record.actividadEconomica}
              />
            ) : null}
            {props.record.fechaActualizacion ? (
              <FieldRow
                delay={560}
                label="Padrón actualizado"
                value={
                  <span className="num" data-tnum>
                    {props.record.fechaActualizacion}
                  </span>
                }
                mono
              />
            ) : null}
          </dl>

          {props.record.sucursales.length > 0 ? (
            <div className="mt-6" data-ledger-row style={{ animationDelay: "560ms" }}>
              <h3 className="text-[11px] font-medium uppercase tracking-[0.1em] text-[color:var(--color-ink-500)]">
                {LABELS.sucursales} · {props.record.sucursales.length}
              </h3>
              <ul className="mt-2 flex flex-col">
                {props.record.sucursales.map((s, i) => (
                  <li
                    key={`${s.codigo ?? i}`}
                    className="border-b border-[color:var(--color-rule)] py-2 text-[14px] text-[color:var(--color-ink-700)]"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span>{s.direccion}</span>
                      {s.codigo ? (
                        <span
                          className="num shrink-0 text-[11px] text-[color:var(--color-ink-500)]"
                          data-tnum
                        >
                          cod · {s.codigo}
                        </span>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="mt-auto pt-6 text-[11px] text-[color:var(--color-ink-500)]">
            Verificado · SUNAT · {formatTime(props.record.consultadoEn)} · peruapi.com
          </p>
        </div>
      ) : null}
    </aside>
  );
}
