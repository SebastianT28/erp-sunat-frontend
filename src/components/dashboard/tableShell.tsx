"use client";

export function Metric({ label, value, tone }: {
  label: string;
  value: string;
  tone?: "default" | "alert" | "verify";
}) {
  const toneClass =
    tone === "alert"
      ? "text-[color:var(--color-alert)]"
      : tone === "verify"
        ? "text-[color:var(--color-verify)]"
        : "text-[color:var(--color-ink-900)]";
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--color-ink-500)]">
        {label}
      </span>
      <span
        key={value}
        data-metric-key={value}
        className={`num font-display text-[24px] font-medium leading-none ${toneClass}`}
        data-tnum
      >
        {value}
      </span>
    </div>
  );
}

export function Divider() {
  return (
    <div className="hidden h-10 w-px bg-[color:var(--color-rule)] sm:block" />
  );
}

export function ActionsBar({
  selectedCount,
  totalCount,
  noun,
  onExcel,
  onPdf,
}: {
  selectedCount: number;
  totalCount: number;
  noun: { singular: string; plural: string };
  onExcel: () => void;
  onPdf: () => void;
}) {
  const exportLabel =
    selectedCount === 0
      ? `Exportará ${totalCount} ${totalCount === 1 ? noun.singular : noun.plural} visible${totalCount === 1 ? "" : "s"}`
      : `Exportará ${selectedCount} de ${totalCount} ${totalCount === 1 ? noun.singular : noun.plural} seleccionada${selectedCount === 1 ? "" : "s"}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[color:var(--color-rule)] px-10 py-3">
      <span className="text-[11px] text-[color:var(--color-ink-500)]">
        {exportLabel}
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onExcel}
          disabled={totalCount === 0}
          className="rounded-sm border border-[color:var(--color-rule-strong)] px-4 py-2 text-[12px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-ink-900)] transition-all duration-200 ease-out hover:-translate-y-px hover:border-[color:var(--color-ink-900)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          Exportar Excel
        </button>
        <button
          type="button"
          onClick={onPdf}
          disabled={totalCount === 0}
          className="rounded-sm border border-[color:var(--color-ink-900)] bg-[color:var(--color-ink-900)] px-4 py-2 text-[12px] font-medium uppercase tracking-[0.08em] text-[color:var(--color-paper-100)] transition-all duration-200 ease-out hover:-translate-y-px hover:bg-[color:var(--color-ink-700)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          Exportar PDF
        </button>
      </div>
    </div>
  );
}

export function CheckBox({
  checked,
  indeterminate,
  onChange,
  ariaLabel,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  ariaLabel: string;
}) {
  return (
    <input
      type="checkbox"
      checked={checked}
      ref={(el) => {
        if (el) el.indeterminate = !!indeterminate && !checked;
      }}
      onChange={onChange}
      aria-label={ariaLabel}
      className="h-[14px] w-[14px] cursor-pointer accent-[color:var(--color-ink-900)] align-middle"
    />
  );
}

export function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function stamp(): string {
  const d = new Date();
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}
