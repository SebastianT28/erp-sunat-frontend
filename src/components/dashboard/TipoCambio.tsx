export default function TipoCambio() {
  return (
    <section
      aria-label="Tipo de cambio SBS"
      className="flex h-full flex-col gap-5 bg-[color:var(--color-paper-200)] px-8 py-7"
    >
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[color:var(--color-ink-500)]">
          Tipo de cambio · SBS
        </span>
        <h2 className="font-display text-[20px] font-semibold leading-none text-[color:var(--color-ink-900)]">
          Dólar americano (USD)
        </h2>
      </div>

      <dl className="grid grid-cols-2 border-y border-[color:var(--color-rule)]">
        <div className="flex flex-col gap-1 border-r border-[color:var(--color-rule)] py-4 pr-4">
          <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-ink-500)]">
            Compra
          </dt>
          <dd
            className="num font-display text-[30px] font-medium leading-none tracking-[-0.01em] text-[color:var(--color-ink-900)]"
            data-tnum
          >
            S/ 3.742
          </dd>
        </div>
        <div className="flex flex-col gap-1 py-4 pl-4">
          <dt className="text-[10px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-ink-500)]">
            Venta
          </dt>
          <dd
            className="num font-display text-[30px] font-medium leading-none tracking-[-0.01em] text-[color:var(--color-ink-900)]"
            data-tnum
          >
            S/ 3.748
          </dd>
        </div>
      </dl>

      <dl className="flex flex-col gap-2 text-[12px]">
        <div className="flex items-baseline justify-between">
          <dt className="text-[color:var(--color-ink-500)]">Fuente</dt>
          <dd className="text-[color:var(--color-ink-900)]">API peruapi.com</dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-[color:var(--color-ink-500)]">Actualizado</dt>
          <dd className="num text-[color:var(--color-ink-900)]" data-tnum>
            17 abr · 09:15
          </dd>
        </div>
        <div className="flex items-baseline justify-between">
          <dt className="text-[color:var(--color-ink-500)]">Variación diaria</dt>
          <dd className="num text-[color:var(--color-verify)]" data-tnum>
            +0.004
          </dd>
        </div>
      </dl>

      <p className="mt-auto text-[11px] text-[color:var(--color-ink-500)]">
        Cotización referencial SBS · no incluye ITF.
      </p>
    </section>
  );
}
