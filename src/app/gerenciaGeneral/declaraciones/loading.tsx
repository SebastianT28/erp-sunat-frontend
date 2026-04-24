import TableSkeleton from "@/components/dashboard/TableSkeleton";

export default function Loading() {
  return (
    <TableSkeleton
      eyebrow="Proceso 04 · Declaraciones tributarias"
      title="Declaraciones presentadas"
      columns={9}
    />
  );
}
