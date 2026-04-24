import { RegistroForm } from "@/components/marketing/registro/RegistroForm";

export default function Marketing() {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--color-paper-100)]">
      <main className="flex-1">
        <RegistroForm />
      </main>
    </div>
  );
}
