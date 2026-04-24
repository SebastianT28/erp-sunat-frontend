"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const PRIMARY = [
  { label: "Dashboard", href: "/gerenciaGeneral", abbr: "01" },
  { label: "Registro", href: "/", abbr: "02" },
  { label: "Guías", href: "/gerenciaGeneral/guias", abbr: "03" },
  { label: "Declaraciones", href: "/gerenciaGeneral/declaraciones", abbr: "04" },
  { label: "Clientes", href: "/gerenciaGeneral/clientes", abbr: "05" },
  { label: "Honorarios", href: "/gerenciaGeneral/honorarios", abbr: "06" },
] as const;

const SECONDARY = [
  { label: "Reportes SUNAT", href: "/gerenciaGeneral/reportes" },
  { label: "Calendario tributario", href: "/gerenciaGeneral/calendario" },
  { label: "Ajustes del estudio", href: "/gerenciaGeneral/ajustes" },
] as const;

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      aria-label="Navegación principal"
      className="sticky top-0 flex h-screen w-[240px] shrink-0 flex-col border-r border-[color:var(--color-rule)] bg-[color:var(--color-paper-200)]"
    >
      <Link
        href="/"
        className="flex items-baseline gap-3 border-b border-[color:var(--color-rule)] px-6 py-5 text-[color:var(--color-ink-900)]"
      >
        <span className="font-display text-[20px] font-semibold leading-none tracking-[-0.02em]">
          ORAID
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-500)]">
          Estudio
        </span>
      </Link>

      <nav className="flex flex-1 flex-col px-3 py-6">
        <span className="px-3 pb-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--color-ink-500)]">
          Procesos
        </span>
        <ul className="flex flex-col">
          {PRIMARY.map((item) => {
            const active =
              item.href === "/gerenciaGeneral"
                ? pathname === "/gerenciaGeneral"
                : pathname.startsWith(item.href) && item.href !== "/";
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`group flex items-baseline justify-between border-l px-3 py-2 text-[13px] transition-colors ${
                    active
                      ? "border-[color:var(--color-ink-900)] font-medium text-[color:var(--color-ink-900)]"
                      : "border-transparent text-[color:var(--color-ink-700)] hover:border-[color:var(--color-rule-strong)] hover:text-[color:var(--color-ink-900)]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className="num text-[10px] text-[color:var(--color-ink-500)]"
                    data-tnum
                  >
                    {item.abbr}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <hr className="rule my-6" />

        <span className="px-3 pb-3 text-[10px] font-medium uppercase tracking-[0.16em] text-[color:var(--color-ink-500)]">
          Gestión
        </span>
        <ul className="flex flex-col">
          {SECONDARY.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block px-3 py-2 text-[13px] text-[color:var(--color-ink-700)] transition-colors hover:text-[color:var(--color-ink-900)]"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-[color:var(--color-rule)] px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-[12px] font-medium text-[color:var(--color-ink-900)]">
            María Fernanda Ríos
          </span>
          <span className="text-[11px] text-[color:var(--color-ink-500)]">
            Asistente contable · ORAID
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-[color:var(--color-ink-500)]">
          <span>Sesión</span>
          <span className="num text-[color:var(--color-verify)]" data-tnum>
            activa
          </span>
        </div>
      </div>
    </aside>
  );
}
