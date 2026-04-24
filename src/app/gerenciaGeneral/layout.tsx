import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[color:var(--color-paper-100)]">
      <Sidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
