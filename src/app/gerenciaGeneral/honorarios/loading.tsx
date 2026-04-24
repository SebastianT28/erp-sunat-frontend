import TableSkeleton from "@/components/dashboard/TableSkeleton";

export default function Loading() {
  return (
    <TableSkeleton
      eyebrow="Proceso 06 · Honorarios"
      title="Recibos por honorarios"
      columns={10}
    />
  );
}
