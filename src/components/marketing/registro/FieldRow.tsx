import type { ReactNode } from "react";

export function FieldRow({
  label,
  value,
  mono,
  delay,
  verified,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
  delay?: number;
  verified?: boolean;
}) {
  return (
    <div
      data-ledger-row
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
      className="flex items-baseline justify-between gap-6 border-b border-[color:var(--color-rule)] py-3"
    >
      <dt className="shrink-0 text-[11px] font-medium uppercase tracking-[0.1em] text-[color:var(--color-ink-500)]">
        {label}
      </dt>
      <dd
        className={`text-right text-[15px] text-[color:var(--color-ink-900)] ${
          mono ? "num" : ""
        }`}
      >
        {value}
      </dd>
      {verified ? (
        <span className="hidden shrink-0 text-[10px] text-[color:var(--color-ink-500)] sm:inline">
          verificado
        </span>
      ) : null}
    </div>
  );
}
