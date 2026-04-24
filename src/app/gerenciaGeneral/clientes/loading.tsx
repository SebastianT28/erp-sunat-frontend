import TableSkeleton from "@/components/dashboard/TableSkeleton";

export default function Loading() {
  return (
    <TableSkeleton
      eyebrow="Proceso 05 · Cartera de clientes"
      title="Clientes registrados"
      columns={8}
    />
  );
}
