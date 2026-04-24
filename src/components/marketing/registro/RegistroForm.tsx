"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SunatRecord } from "./SunatRecord";
import {
  cleanDoc,
  detectKind,
  isValidDni,
  isValidRuc,
  type ContribuyenteRecord,
} from "@/lib/sunat";

type Lookup =
  | { state: "empty" }
  | { state: "loading"; doc: string }
  | { state: "error"; message: string }
  | { state: "ready"; record: ContribuyenteRecord };

const REGIMEN_OPTIONS = ["NRUS", "RER", "RMT", "Régimen General"] as const;
const SERVICIO_OPTIONS = [
  "Contabilidad mensual",
  "Planilla",
  "Declaración anual",
  "Asesoría tributaria",
] as const;

export function RegistroForm() {
  const [doc, setDoc] = useState("");
  const [lookup, setLookup] = useState<Lookup>({ state: "empty" });
  const [commercial, setCommercial] = useState({
    correo: "",
    telefono: "",
    regimen: "" as (typeof REGIMEN_OPTIONS)[number] | "",
    servicio: "" as (typeof SERVICIO_OPTIONS)[number] | "",
    tarifa: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const cleaned = cleanDoc(doc);
  const kind = detectKind(cleaned);
  const formatErr = useMemo(() => {
    if (!doc) return null;
    if (!kind) return "Ingrese 11 dígitos (RUC) u 8 dígitos (DNI).";
    if (kind === "ruc" && !isValidRuc(cleaned))
      return "El RUC no pasa la verificación módulo-11 de SUNAT.";
    if (kind === "dni" && !isValidDni(cleaned)) return "El DNI debe tener 8 dígitos.";
    return null;
  }, [doc, kind, cleaned]);

  useEffect(() => {
    abortRef.current?.abort();
    if (!kind || formatErr) {
      setLookup({ state: "empty" });
      return;
    }
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = window.setTimeout(() => {
      setLookup({ state: "loading", doc: cleaned });
      fetch(`/api/sunat/${cleaned}`, { signal: controller.signal })
        .then(async (res) => {
          const json = (await res.json()) as
            | ContribuyenteRecord
            | { error: string };
          if (!res.ok) {
            const msg = "error" in json ? json.error : "No se pudo consultar.";
            setLookup({ state: "error", message: msg });
            return;
          }
          setLookup({ state: "ready", record: json as ContribuyenteRecord });
        })
        .catch((err: unknown) => {
          if (err instanceof DOMException && err.name === "AbortError") return;
          setLookup({
            state: "error",
            message: "No se pudo contactar al servidor.",
          });
        });
    }, 320);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [cleaned, kind, formatErr]);

  const isReady = lookup.state === "ready";
  const isAlert =
    isReady &&
    lookup.record.kind === "ruc" &&
    (lookup.record.estado !== "ACTIVO" || lookup.record.condicion !== "HABIDO");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)]">
      {/* LEFT — Form */}
      <div className="flex flex-col px-6 py-12 sm:px-10 md:px-14 lg:py-20">
        <div className="max-w-[640px]">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-500)]">
            Proceso A · Registro de contribuyente
          </span>
          <h1 className="mt-4 font-display text-[clamp(34px,4.2vw,48px)] font-medium leading-[1.05] tracking-[-0.015em] text-[color:var(--color-ink-900)]">
            Un número. El expediente completo.
          </h1>
          <p className="mt-4 max-w-[56ch] text-[16px] leading-[1.6] text-[color:var(--color-ink-700)]">
            Escriba el <strong>RUC</strong> o <strong>DNI</strong> del
            contribuyente. El padrón oficial de SUNAT se consulta en tiempo real
            y aparece en el expediente de la derecha.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-10">
          <section>
            <label
              htmlFor="doc"
              className="mb-3 block text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--color-ink-500)]"
            >
              Documento de identidad fiscal
            </label>
            <div className="relative flex items-baseline gap-3 border-b border-[color:var(--color-rule-strong)] pb-3 transition-[border-color] focus-within:border-[color:var(--color-ink-900)]">
              <span className="num text-[12px] font-medium text-[color:var(--color-ink-500)]">
                {kind ? kind.toUpperCase() : "···"}
              </span>
              <input
                id="doc"
                name="doc"
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                data-kind="num"
                value={doc}
                onChange={(e) => setDoc(e.target.value)}
                placeholder="20607599727"
                maxLength={11}
                className="num flex-1 bg-transparent text-[clamp(28px,3vw,36px)] font-medium tracking-[-0.01em] text-[color:var(--color-ink-900)] placeholder:text-[color:var(--color-ink-300)] focus:outline-none"
                aria-invalid={formatErr ? true : undefined}
                aria-describedby="doc-help"
              />
              {lookup.state === "loading" ? (
                <span className="text-[12px] uppercase tracking-[0.1em] text-[color:var(--color-ink-500)]">
                  consultando…
                </span>
              ) : null}
              {lookup.state === "ready" ? (
                <span className="text-[12px] uppercase tracking-[0.1em] text-[color:var(--color-verify)]">
                  verificado
                </span>
              ) : null}
            </div>
            <p
              id="doc-help"
              className={`mt-2 text-[13px] ${
                formatErr
                  ? "text-[color:var(--color-alert)]"
                  : "text-[color:var(--color-ink-500)]"
              }`}
            >
              {formatErr ?? "11 dígitos para RUC · 8 dígitos para DNI."}
            </p>
          </section>

          {isAlert && lookup.state === "ready" ? (
            <div className="bg-[color:var(--color-alert-soft)] px-4 py-3 text-[14px] text-[color:var(--color-alert)]">
              <strong>Atención:</strong> {lookup.record.razonSocial} figura como{" "}
              <strong>{lookup.record.estado}</strong> ·{" "}
              <strong>{lookup.record.condicion}</strong>. Confirme la vigencia
              antes de firmar el contrato.
            </div>
          ) : null}

          <section aria-disabled={!isReady} className={isReady ? "" : "opacity-55"}>
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="text-[11px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-ink-500)]">
                Datos comerciales
              </h2>
              <span className="text-[11px] text-[color:var(--color-ink-500)]">
                {isReady ? "disponibles" : "bloqueados"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2">
              <Field
                label="Correo electrónico"
                input={
                  <input
                    type="email"
                    name="correo"
                    disabled={!isReady}
                    value={commercial.correo}
                    onChange={(e) =>
                      setCommercial((c) => ({ ...c, correo: e.target.value }))
                    }
                    placeholder="contacto@empresa.pe"
                  />
                }
              />
              <Field
                label="Teléfono de contacto"
                input={
                  <input
                    type="tel"
                    name="telefono"
                    inputMode="tel"
                    data-kind="num"
                    disabled={!isReady}
                    value={commercial.telefono}
                    onChange={(e) =>
                      setCommercial((c) => ({ ...c, telefono: e.target.value }))
                    }
                    placeholder="+51 999 999 999"
                  />
                }
              />
              <Field
                label="Régimen tributario"
                input={
                  <select
                    name="regimen"
                    disabled={!isReady}
                    value={commercial.regimen}
                    onChange={(e) =>
                      setCommercial((c) => ({
                        ...c,
                        regimen: e.target.value as typeof c.regimen,
                      }))
                    }
                  >
                    <option value="" disabled>
                      Seleccione un régimen
                    </option>
                    {REGIMEN_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                }
              />
              <Field
                label="Servicio contratado"
                input={
                  <select
                    name="servicio"
                    disabled={!isReady}
                    value={commercial.servicio}
                    onChange={(e) =>
                      setCommercial((c) => ({
                        ...c,
                        servicio: e.target.value as typeof c.servicio,
                      }))
                    }
                  >
                    <option value="" disabled>
                      Seleccione el servicio
                    </option>
                    {SERVICIO_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                }
              />
              <Field
                label="Tarifa mensual acordada"
                span={2}
                input={
                  <div className="flex items-baseline gap-3">
                    <span className="num text-[13px] font-medium text-[color:var(--color-ink-500)]">
                      S/
                    </span>
                    <input
                      name="tarifa"
                      inputMode="decimal"
                      data-kind="num"
                      disabled={!isReady}
                      value={commercial.tarifa}
                      onChange={(e) =>
                        setCommercial((c) => ({ ...c, tarifa: e.target.value }))
                      }
                      placeholder="0.00"
                      className="num flex-1"
                    />
                  </div>
                }
              />
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[color:var(--color-rule)] pt-6">
            <p className="text-[12px] text-[color:var(--color-ink-500)]">
              Al registrar, ORAID guardará el expediente y abrirá la ficha del
              contribuyente.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setDoc("");
                  setCommercial({
                    correo: "",
                    telefono: "",
                    regimen: "",
                    servicio: "",
                    tarifa: "",
                  });
                  setLookup({ state: "empty" });
                  setSubmitted(false);
                }}
                className="rounded-sm px-3 py-2 text-[13px] font-medium text-[color:var(--color-ink-500)] transition-colors hover:text-[color:var(--color-ink-900)]"
              >
                Limpiar
              </button>
              <button
                type="submit"
                disabled={!isReady}
                className="rounded-sm bg-[color:var(--color-ink-900)] px-5 py-3 text-[14px] font-medium text-[color:var(--color-paper-100)] transition-[transform,background-color] duration-200 ease-out hover:-translate-y-px hover:bg-[color:var(--color-ink-700)] disabled:cursor-not-allowed disabled:bg-[color:var(--color-paper-300)] disabled:text-[color:var(--color-ink-500)] disabled:hover:translate-y-0"
              >
                Registrar contribuyente →
              </button>
            </div>
          </div>

          {submitted && isReady ? (
            <div className="border border-[color:var(--color-verify)] bg-[color:var(--color-verify-soft)] px-5 py-4 text-[14px] text-[color:var(--color-verify)]">
              <strong>Expediente listo.</strong> {lookup.record.razonSocial} quedó
              registrado como cliente ORAID. (Persistencia backend llega en una
              próxima iteración.)
            </div>
          ) : null}
        </form>
      </div>

      {/* RIGHT — SUNAT record */}
      <div className="border-t border-[color:var(--color-rule)] lg:border-l lg:border-t-0">
        <SunatRecord
          {...(lookup.state === "empty"
            ? { state: "empty" as const }
            : lookup.state === "loading"
              ? { state: "loading" as const, doc: lookup.doc }
              : lookup.state === "error"
                ? { state: "error" as const, message: lookup.message }
                : { state: "ready" as const, record: lookup.record })}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  input,
  span,
}: {
  label: string;
  input: React.ReactNode;
  span?: 1 | 2;
}) {
  return (
    <label
      className={`flex flex-col gap-2 ${span === 2 ? "sm:col-span-2" : ""}`}
    >
      <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[color:var(--color-ink-500)]">
        {label}
      </span>
      <span className="flex items-baseline border-b border-[color:var(--color-rule)] pb-2 transition-[border-color] focus-within:border-[color:var(--color-ink-900)] [&_input]:w-full [&_input]:bg-transparent [&_input]:py-1 [&_input]:text-[15px] [&_input]:text-[color:var(--color-ink-900)] [&_input]:placeholder:text-[color:var(--color-ink-300)] [&_input]:focus:outline-none [&_input]:disabled:text-[color:var(--color-ink-300)] [&_select]:w-full [&_select]:appearance-none [&_select]:bg-transparent [&_select]:py-1 [&_select]:text-[15px] [&_select]:text-[color:var(--color-ink-900)] [&_select]:focus:outline-none [&_select]:disabled:text-[color:var(--color-ink-300)]">
        {input}
      </span>
    </label>
  );
}
