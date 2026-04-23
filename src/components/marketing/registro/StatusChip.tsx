import type { Condicion, Estado } from "@/lib/sunat";

type Tone = "verify" | "alert" | "neutral";

function toneFor(kind: "estado" | "condicion", value: string): Tone {
  if (kind === "estado") {
    if (value === "ACTIVO") return "verify";
    if (value === "BAJA" || value === "SUSPENDIDO") return "alert";
  }
  if (kind === "condicion") {
    if (value === "HABIDO") return "verify";
    if (value === "NO HABIDO") return "alert";
  }
  return "neutral";
}

const TONE_STYLES: Record<Tone, { bg: string; fg: string; dot: string }> = {
  verify: {
    bg: "bg-[color:var(--color-verify-soft)]",
    fg: "text-[color:var(--color-verify)]",
    dot: "bg-[color:var(--color-verify)]",
  },
  alert: {
    bg: "bg-[color:var(--color-alert-soft)]",
    fg: "text-[color:var(--color-alert)]",
    dot: "bg-[color:var(--color-alert)]",
  },
  neutral: {
    bg: "bg-[color:var(--color-paper-200)]",
    fg: "text-[color:var(--color-ink-500)]",
    dot: "bg-[color:var(--color-ink-500)]",
  },
};

export function StatusChip({
  label,
  value,
  kind,
}: {
  label: string;
  value: Estado | Condicion;
  kind: "estado" | "condicion";
}) {
  const tone = toneFor(kind, value);
  const s = TONE_STYLES[tone];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-sm px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.08em] ${s.bg} ${s.fg}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden />
      <span className="opacity-70">{label}</span>
      <span>·</span>
      <span>{value}</span>
    </span>
  );
}
