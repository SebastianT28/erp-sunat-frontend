import TableSkeleton from "@/components/dashboard/TableSkeleton";

export default function Loading() {
  return (
    <TableSkeleton
      eyebrow="Proceso 03 · Guías de remisión"
      title="Guías emitidas"
      columns={8}
    />
  );
}
