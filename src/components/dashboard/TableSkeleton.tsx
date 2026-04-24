type Props = {
  eyebrow: string;
  title: string;
  columns: number;
  rows?: number;
};

export default function TableSkeleton({ eyebrow, title, columns, rows = 6 }: Props) {
  return (
    <div className="flex flex-col">
      <header className="flex flex-col gap-6 border-b border-[color:var(--color-rule)] px-10 py-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-500)]">
            {eyebrow}
          </span>
          <h1 className="font-display text-[clamp(28px,3.2vw,38px)] font-medium leading-[1.05] tracking-[-0.015em] text-[color:var(--color-ink-900)] caret-blink">
            {title}
          </h1>
          <div className="skeleton h-3 w-[260px]" />
        </div>
        <div className="skeleton h-7 w-[180px]" />
      </header>

      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[color:var(--color-rule)] px-10 py-6">
        <div className="flex items-baseline gap-6">
          <SkeletonMetric />
          <Divider />
          <SkeletonMetric />
          <Divider />
          <SkeletonMetric />
        </div>
        <div className="skeleton h-3 w-[200px]" />
      </div>

      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--color-rule)] px-10 py-3">
        <div className="skeleton h-3 w-[180px]" />
        <div className="flex gap-2">
          <div className="skeleton h-8 w-[120px]" />
          <div className="skeleton h-8 w-[120px]" />
        </div>
      </div>

      <div className="px-10 py-6">
        <div className="mb-4 flex gap-6 border-b border-[color:var(--color-rule-strong)] pb-3">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="skeleton h-3 flex-1" />
          ))}
        </div>
        <ul className="flex flex-col gap-4">
          {Array.from({ length: rows }).map((_, i) => (
            <li
              key={i}
              className="flex gap-6 border-b border-[color:var(--color-rule)] pb-4"
              style={{ ["--row-index" as never]: i }}
              data-row-in
            >
              {Array.from({ length: columns }).map((_, c) => (
                <div
                  key={c}
                  className="skeleton h-3 flex-1"
                  style={{
                    maxWidth:
                      c === 0 ? "8%" : c === columns - 1 ? "10%" : undefined,
                  }}
                />
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SkeletonMetric() {
  return (
    <div className="flex flex-col gap-2">
      <div className="skeleton h-2 w-[100px]" />
      <div className="skeleton h-6 w-[120px]" />
    </div>
  );
}

function Divider() {
  return <div className="hidden h-10 w-px bg-[color:var(--color-rule)] sm:block" />;
}
