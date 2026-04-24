export default function Loading() {
  return (
    <div className="flex flex-col">
      <header className="flex flex-col gap-6 border-b border-[color:var(--color-rule)] px-10 py-8 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[color:var(--color-ink-500)]">
            Proceso D · Vista gerencial
          </span>
          <h1 className="font-display text-[clamp(28px,3.2vw,38px)] font-medium leading-[1.05] tracking-[-0.015em] text-[color:var(--color-ink-900)] caret-blink">
            Dashboard gerencial
          </h1>
          <div className="skeleton h-3 w-[260px]" />
        </div>
        <div className="flex gap-3">
          <div className="skeleton h-8 w-[140px]" />
          <div className="skeleton h-8 w-[120px]" />
          <div className="skeleton h-8 w-[120px]" />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-px border-b border-[color:var(--color-rule)] bg-[color:var(--color-rule)] md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 bg-[color:var(--color-paper-100)] px-8 py-7"
            style={{ ["--row-index" as never]: i }}
            data-row-in
          >
            <div className="skeleton h-3 w-[120px]" />
            <div className="skeleton h-7 w-[160px]" />
            <div className="skeleton h-2 w-[90px]" />
          </div>
        ))}
      </div>

      <section className="grid grid-cols-1 border-b border-[color:var(--color-rule)] lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="border-b border-[color:var(--color-rule)] px-8 py-7 lg:border-b-0 lg:border-r">
          <div className="skeleton mb-4 h-3 w-[140px]" />
          <div className="skeleton mb-6 h-5 w-[220px]" />
          <ul className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <li
                key={i}
                style={{ ["--row-index" as never]: i }}
                data-row-in
                className="flex items-center gap-4"
              >
                <div className="skeleton h-2 w-2 rounded-full" />
                <div className="skeleton h-3 flex-1" />
                <div className="skeleton h-3 w-[60px]" />
              </li>
            ))}
          </ul>
        </div>
        <div className="px-8 py-7">
          <div className="skeleton mb-4 h-3 w-[140px]" />
          <div className="skeleton mb-8 h-9 w-[180px]" />
          <div className="skeleton h-[160px] w-full" />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <div className="border-b border-[color:var(--color-rule)] px-8 py-7 lg:border-b-0 lg:border-r">
          <div className="skeleton mb-4 h-3 w-[160px]" />
          <div className="skeleton mb-6 h-5 w-[200px]" />
          <ul className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                style={{ ["--row-index" as never]: i }}
                data-row-in
              >
                <div className="mb-2 flex justify-between">
                  <div className="skeleton h-3 w-[120px]" />
                  <div className="skeleton h-3 w-[80px]" />
                </div>
                <div className="skeleton h-[6px] w-full" />
              </li>
            ))}
          </ul>
        </div>
        <div className="px-8 py-7">
          <div className="skeleton mb-4 h-3 w-[140px]" />
          <div className="skeleton mb-8 h-5 w-[200px]" />
          <div className="skeleton h-[220px] w-full" />
        </div>
      </section>
    </div>
  );
}
